"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const login_repository_port_1 = require("../../core/ports/login-repository.port");
const validation_exception_1 = require("../../core/exceptions/validation.exception");
const fast_crud_exception_1 = require("../../core/exceptions/fast-crud.exception");
let LoginService = class LoginService {
    constructor(repository) {
        this.repository = repository;
    }
    async register(dto) {
        try {
            console.log('[FAST-CRUD] LoginService.register called');
            if (dto.basicAuth?.email) {
                const existingEmail = await this.repository.findByEmail(dto.basicAuth.email);
                if (existingEmail) {
                    throw new validation_exception_1.FastCrudValidationException('Email already exists', { email: dto.basicAuth.email });
                }
            }
            if (dto.basicAuth?.username) {
                const existingUsername = await this.repository.findByUsername(dto.basicAuth.username);
                if (existingUsername) {
                    throw new validation_exception_1.FastCrudValidationException('Username already exists', { username: dto.basicAuth.username });
                }
            }
            if (dto.basicAuth?.password && dto.basicAuth?.confirmPassword) {
                if (dto.basicAuth.password !== dto.basicAuth.confirmPassword) {
                    throw new validation_exception_1.FastCrudValidationException('Passwords do not match');
                }
            }
            return await this.repository.create(dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('REGISTER_FAILED', 'Failed to register user', 500, error);
        }
    }
    async login(emailOrUsername, password) {
        try {
            console.log('[FAST-CRUD] LoginService.login called');
            let user = await this.repository.findByEmail(emailOrUsername);
            if (!user) {
                user = await this.repository.findByUsername(emailOrUsername);
            }
            if (!user) {
                throw new validation_exception_1.FastCrudValidationException('Invalid credentials');
            }
            if (user.security?.lockedUntil && new Date(user.security.lockedUntil) > new Date()) {
                throw new validation_exception_1.FastCrudValidationException('Account is temporarily locked');
            }
            await this.repository.updateLastLogin(user.id);
            await this.repository.resetLoginAttempts(user.id);
            return user;
        }
        catch (error) {
            if (emailOrUsername) {
                try {
                    let user = await this.repository.findByEmail(emailOrUsername);
                    if (!user) {
                        user = await this.repository.findByUsername(emailOrUsername);
                    }
                    if (user) {
                        await this.repository.incrementLoginAttempts(user.id);
                    }
                }
                catch (updateError) {
                    console.error('[FAST-CRUD] Failed to increment login attempts:', updateError);
                }
            }
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('LOGIN_FAILED', 'Failed to authenticate user', 401, error);
        }
    }
    async socialLogin(provider, socialId, profileData) {
        try {
            console.log('[FAST-CRUD] LoginService.socialLogin called', { provider, socialId });
            let user = await this.repository.findBySocialId(provider, socialId);
            if (!user && profileData?.email) {
                user = await this.repository.findByEmail(profileData.email);
                if (user) {
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
                throw new validation_exception_1.FastCrudValidationException('Social account not found. Please register first.');
            }
            await this.repository.updateLastLogin(user.id);
            return user;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SOCIAL_LOGIN_FAILED', 'Failed to authenticate with social provider', 401, error);
        }
    }
    async socialRegister(provider, socialId, profileData) {
        try {
            console.log('[FAST-CRUD] LoginService.socialRegister called');
            const existingSocial = await this.repository.findBySocialId(provider, socialId);
            if (existingSocial) {
                throw new validation_exception_1.FastCrudValidationException('Social account already registered');
            }
            if (profileData.email) {
                const existingEmail = await this.repository.findByEmail(profileData.email);
                if (existingEmail) {
                    throw new validation_exception_1.FastCrudValidationException('Email already registered');
                }
            }
            const createDto = {
                basicAuth: {
                    email: profileData.email,
                    primaryProvider: provider,
                    status: 'active',
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
                    linkedProviders: [provider],
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
            };
            return await this.repository.create(createDto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SOCIAL_REGISTER_FAILED', 'Failed to register with social provider', 500, error);
        }
    }
    async create(dto) {
        return this.register(dto);
    }
    async findAll(params = {}) {
        try {
            return await this.repository.findAll(params);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve users', 500, error);
        }
    }
    async findById(id) {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`User with ID ${id} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve user', 500, error);
        }
    }
    async findByEmail(email) {
        try {
            const result = await this.repository.findByEmail(email);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`User with email ${email} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_BY_EMAIL_FAILED', 'Failed to retrieve user by email', 500, error);
        }
    }
    async update(id, dto) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`User with ID ${id} not found`);
            }
            if (dto.basicAuth?.email) {
                const existingEmail = await this.repository.findByEmail(dto.basicAuth.email);
                if (existingEmail && existingEmail.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('Email already exists', { email: dto.basicAuth.email });
                }
            }
            if (dto.basicAuth?.username) {
                const existingUsername = await this.repository.findByUsername(dto.basicAuth.username);
                if (existingUsername && existingUsername.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('Username already exists', { username: dto.basicAuth.username });
                }
            }
            return await this.repository.update(id, dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_FAILED', 'Failed to update user', 500, error);
        }
    }
    async softDelete(id) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`User with ID ${id} not found`);
            }
            await this.repository.softDelete(id);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('DELETE_FAILED', 'Failed to delete user', 500, error);
        }
    }
    async changePassword(id, oldPassword, newPassword) {
        try {
            const user = await this.repository.findById(id);
            if (!user) {
                throw new validation_exception_1.FastCrudValidationException(`User with ID ${id} not found`);
            }
            await this.repository.updatePassword(id, newPassword);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CHANGE_PASSWORD_FAILED', 'Failed to change password', 500, error);
        }
    }
    async resetPassword(email) {
        try {
            const user = await this.repository.findByEmail(email);
            if (!user) {
                throw new validation_exception_1.FastCrudValidationException(`User with email ${email} not found`);
            }
            console.log('[FAST-CRUD] Password reset requested for:', email);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('RESET_PASSWORD_FAILED', 'Failed to reset password', 500, error);
        }
    }
    async lockAccount(id, lockDuration = 300000) {
        try {
            const lockUntil = new Date(Date.now() + lockDuration);
            await this.repository.lockAccount(id, lockUntil);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('LOCK_ACCOUNT_FAILED', 'Failed to lock account', 500, error);
        }
    }
    async unlockAccount(id) {
        try {
            await this.repository.unlockAccount(id);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('UNLOCK_ACCOUNT_FAILED', 'Failed to unlock account', 500, error);
        }
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(login_repository_port_1.LOGIN_REPOSITORY_PORT)),
    __metadata("design:paramtypes", [Object])
], LoginService);
//# sourceMappingURL=login.service.js.map