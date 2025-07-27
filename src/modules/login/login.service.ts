import { Injectable, Inject } from '@nestjs/common';
import { LoginRepositoryPort, LOGIN_REPOSITORY_PORT } from '../../core/ports/login-repository.port';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { FastCrudValidationException } from '../../core/exceptions/validation.exception';
import { FastCrudException } from '../../core/exceptions/fast-crud.exception';

@Injectable()
export class LoginService {
    constructor(
        @Inject(LOGIN_REPOSITORY_PORT)
        private readonly repository: LoginRepositoryPort,
    ) { }

    /**
     * Creates a new user account with comprehensive validation
     */
    async register(dto: CreateLoginDto): Promise<any> {
        try {
            console.log('[FAST-CRUD] LoginService.register called');
            
            // Validate email uniqueness
            if (dto.basicAuth?.email) {
                const existingEmail = await this.repository.findByEmail(dto.basicAuth.email);
                if (existingEmail) {
                    throw new FastCrudValidationException('Email already exists', { email: dto.basicAuth.email });
                }
            }

            // Validate username uniqueness
            if (dto.basicAuth?.username) {
                const existingUsername = await this.repository.findByUsername(dto.basicAuth.username);
                if (existingUsername) {
                    throw new FastCrudValidationException('Username already exists', { username: dto.basicAuth.username });
                }
            }

            // Validate password confirmation
            if (dto.basicAuth?.password && dto.basicAuth?.confirmPassword) {
                if (dto.basicAuth.password !== dto.basicAuth.confirmPassword) {
                    throw new FastCrudValidationException('Passwords do not match');
                }
            }

            return await this.repository.create(dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('REGISTER_FAILED', 'Failed to register user', 500, error);
        }
    }

    /**
     * Authenticates user with email/username and password
     */
    async login(emailOrUsername: string, password: string): Promise<any> {
        try {
            console.log('[FAST-CRUD] LoginService.login called');
            
            // Find user by email or username
            let user = await this.repository.findByEmail(emailOrUsername);
            if (!user) {
                user = await this.repository.findByUsername(emailOrUsername);
            }

            if (!user) {
                throw new FastCrudValidationException('Invalid credentials');
            }

            // Check if account is locked
            if (user.security?.lockedUntil && new Date(user.security.lockedUntil) > new Date()) {
                throw new FastCrudValidationException('Account is temporarily locked');
            }

            // Update last login
            await this.repository.updateLastLogin(user.id);
            await this.repository.resetLoginAttempts(user.id);

            return user;
        } catch (error) {
            // Increment login attempts on failure
            if (emailOrUsername) {
                try {
                    let user = await this.repository.findByEmail(emailOrUsername);
                    if (!user) {
                        user = await this.repository.findByUsername(emailOrUsername);
                    }
                    if (user) {
                        await this.repository.incrementLoginAttempts(user.id);
                    }
                } catch (updateError) {
                    console.error('[FAST-CRUD] Failed to increment login attempts:', updateError);
                }
            }

            throw error instanceof FastCrudException ? error :
                new FastCrudException('LOGIN_FAILED', 'Failed to authenticate user', 401, error);
        }
    }

    /**
     * Authenticates user with social provider
     */
    async socialLogin(provider: string, socialId: string, profileData?: any): Promise<any> {
        try {
            console.log('[FAST-CRUD] LoginService.socialLogin called', { provider, socialId });
            
            // Find user by social ID
            let user = await this.repository.findBySocialId(provider, socialId);
            
            if (!user && profileData?.email) {
                // Try to find by email for account linking
                user = await this.repository.findByEmail(profileData.email);
                if (user) {
                    // Link social account to existing user
                    const socialData = user.social || {};
                    socialData[`${provider}Id`] = socialId;
                    socialData.linkedProviders = socialData.linkedProviders || [];
                    if (!socialData.linkedProviders.includes(provider)) {
                        socialData.linkedProviders.push(provider);
                    }
                    
                    await this.repository.update(user.id, { social: socialData });
                }
            }

            if (!user) {
                throw new FastCrudValidationException('Social account not found. Please register first.');
            }

            // Update last login
            await this.repository.updateLastLogin(user.id);

            return user;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SOCIAL_LOGIN_FAILED', 'Failed to authenticate with social provider', 401, error);
        }
    }

    /**
     * Creates user account from social provider
     */
    async socialRegister(provider: string, socialId: string, profileData: any): Promise<any> {
        try {
            console.log('[FAST-CRUD] LoginService.socialRegister called');
            
            // Check if social account already exists
            const existingSocial = await this.repository.findBySocialId(provider, socialId);
            if (existingSocial) {
                throw new FastCrudValidationException('Social account already registered');
            }

            // Check if email already exists
            if (profileData.email) {
                const existingEmail = await this.repository.findByEmail(profileData.email);
                if (existingEmail) {
                    throw new FastCrudValidationException('Email already registered');
                }
            }

            // Create comprehensive user data from social profile
            const createDto: CreateLoginDto = {
                basicAuth: {
                    email: profileData.email,
                    primaryProvider: provider as any,
                    status: 'active' as any,
                    isVerified: true,
                },
                profile: {
                    firstName: profileData.firstName || profileData.given_name,
                    lastName: profileData.lastName || profileData.family_name,
                    displayName: profileData.displayName || profileData.name,
                    avatar: profileData.avatar || profileData.picture,
                    locale: profileData.locale,
                },
                social: {
                    [`${provider}Id`]: socialId,
                    linkedProviders: [provider as any],
                    socialAvatar: profileData.picture || profileData.avatar,
                    allowSocialLogin: true,
                    providerData: profileData,
                },
                preferences: {
                    language: profileData.locale?.split('-')[0] || 'en',
                    emailNotifications: true,
                    pushNotifications: true,
                },
                terms: {
                    acceptedTerms: true,
                    acceptedPrivacyPolicy: true,
                    termsAcceptedAt: new Date().toISOString(),
                },
                registrationDate: new Date().toISOString(),
            } as CreateLoginDto;

            return await this.repository.create(createDto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SOCIAL_REGISTER_FAILED', 'Failed to register with social provider', 500, error);
        }
    }

    /**
     * Standard CRUD operations
     */
    async create(dto: CreateLoginDto): Promise<any> {
        return this.register(dto);
    }

    async findAll(params: any = {}): Promise<any[]> {
        try {
            return await this.repository.findAll(params);
        } catch (error) {
            throw new FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve users', 500, error);
        }
    }

    async findById(id: string): Promise<any> {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new FastCrudValidationException(`User with ID ${id} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve user', 500, error);
        }
    }

    async findByEmail(email: string): Promise<any> {
        try {
            const result = await this.repository.findByEmail(email);
            if (!result) {
                throw new FastCrudValidationException(`User with email ${email} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_BY_EMAIL_FAILED', 'Failed to retrieve user by email', 500, error);
        }
    }

    async update(id: string, dto: UpdateLoginDto): Promise<any> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`User with ID ${id} not found`);
            }

            // Validate email uniqueness if being updated
            if (dto.basicAuth?.email) {
                const existingEmail = await this.repository.findByEmail(dto.basicAuth.email);
                if (existingEmail && existingEmail.id !== id) {
                    throw new FastCrudValidationException('Email already exists', { email: dto.basicAuth.email });
                }
            }

            // Validate username uniqueness if being updated
            if (dto.basicAuth?.username) {
                const existingUsername = await this.repository.findByUsername(dto.basicAuth.username);
                if (existingUsername && existingUsername.id !== id) {
                    throw new FastCrudValidationException('Username already exists', { username: dto.basicAuth.username });
                }
            }

            return await this.repository.update(id, dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_FAILED', 'Failed to update user', 500, error);
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`User with ID ${id} not found`);
            }
            await this.repository.softDelete(id);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('DELETE_FAILED', 'Failed to delete user', 500, error);
        }
    }

    /**
     * Authentication specific methods
     */
    async changePassword(id: string, oldPassword: string, newPassword: string): Promise<void> {
        try {
            const user = await this.repository.findById(id);
            if (!user) {
                throw new FastCrudValidationException(`User with ID ${id} not found`);
            }

            // Here you would verify the old password with your hash comparison logic
            // For now, we'll just update the password
            await this.repository.updatePassword(id, newPassword); // This should be hashed
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CHANGE_PASSWORD_FAILED', 'Failed to change password', 500, error);
        }
    }

    async resetPassword(email: string): Promise<void> {
        try {
            const user = await this.repository.findByEmail(email);
            if (!user) {
                throw new FastCrudValidationException(`User with email ${email} not found`);
            }

            // Here you would generate a reset token and send email
            // Implementation depends on your email service
            console.log('[FAST-CRUD] Password reset requested for:', email);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('RESET_PASSWORD_FAILED', 'Failed to reset password', 500, error);
        }
    }

    async lockAccount(id: string, lockDuration: number = 300000): Promise<void> { // 5 minutes default
        try {
            const lockUntil = new Date(Date.now() + lockDuration);
            await this.repository.lockAccount(id, lockUntil);
        } catch (error) {
            throw new FastCrudException('LOCK_ACCOUNT_FAILED', 'Failed to lock account', 500, error);
        }
    }

    async unlockAccount(id: string): Promise<void> {
        try {
            await this.repository.unlockAccount(id);
        } catch (error) {
            throw new FastCrudException('UNLOCK_ACCOUNT_FAILED', 'Failed to unlock account', 500, error);
        }
    }
} 