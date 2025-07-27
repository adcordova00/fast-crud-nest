import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';

// DTOs for specific authentication endpoints
class LoginCredentialsDto {
    emailOrUsername!: string;
    password!: string;
    rememberMe?: boolean;
    deviceInfo?: string;
}

class SocialLoginDto {
    provider!: string;
    accessToken!: string;
    socialId!: string;
    profileData?: any;
}

class ChangePasswordDto {
    oldPassword!: string;
    newPassword!: string;
    confirmPassword!: string;
}

class ResetPasswordDto {
    email!: string;
}

class ForgotPasswordDto {
    email!: string;
}

@Controller('auth')
export class LoginController {
    constructor(private readonly service: LoginService) { }

    /**
     * User Registration
     */
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto: CreateLoginDto) {
        return await this.service.register(dto);
    }

    /**
     * User Login with credentials
     */
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() credentials: LoginCredentialsDto) {
        return await this.service.login(
            credentials.emailOrUsername,
            credentials.password
        );
    }

    /**
     * Social Login (Google, Facebook, GitHub, etc.)
     */
    @Post('social/login')
    @HttpCode(HttpStatus.OK)
    async socialLogin(@Body() socialData: SocialLoginDto) {
        return await this.service.socialLogin(
            socialData.provider,
            socialData.socialId,
            socialData.profileData
        );
    }

    /**
     * Social Registration
     */
    @Post('social/register')
    @HttpCode(HttpStatus.CREATED)
    async socialRegister(@Body() socialData: SocialLoginDto) {
        return await this.service.socialRegister(
            socialData.provider,
            socialData.socialId,
            socialData.profileData
        );
    }

    /**
     * Change Password
     */
    @Put('password/change/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async changePassword(
        @Param('id') id: string,
        @Body() passwordData: ChangePasswordDto
    ) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        await this.service.changePassword(
            id,
            passwordData.oldPassword,
            passwordData.newPassword
        );
    }

    /**
     * Reset Password (with token)
     */
    @Post('password/reset')
    @HttpCode(HttpStatus.NO_CONTENT)
    async resetPassword(@Body() resetData: ResetPasswordDto) {
        await this.service.resetPassword(resetData.email);
    }

    /**
     * Forgot Password (request reset)
     */
    @Post('password/forgot')
    @HttpCode(HttpStatus.NO_CONTENT)
    async forgotPassword(@Body() forgotData: ForgotPasswordDto) {
        await this.service.resetPassword(forgotData.email);
    }

    /**
     * Lock User Account
     */
    @Put('account/lock/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async lockAccount(@Param('id') id: string) {
        await this.service.lockAccount(id);
    }

    /**
     * Unlock User Account
     */
    @Put('account/unlock/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async unlockAccount(@Param('id') id: string) {
        await this.service.unlockAccount(id);
    }

    /**
     * Standard CRUD Operations
     */

    @Post('users')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateLoginDto) {
        return await this.service.create(dto);
    }

    @Get('users')
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
        @Query('status') status?: string,
        @Query('role') role?: string,
        @Query('provider') provider?: string
    ) {
        const params = {
            page: +page,
            limit: +limit,
            search,
            status,
            role,
            provider
        };
        return await this.service.findAll(params);
    }

    @Get('users/:id')
    async findById(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @Get('users/email/:email')
    async findByEmail(@Param('email') email: string) {
        return await this.service.findByEmail(email);
    }

    @Put('users/:id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateLoginDto
    ) {
        return await this.service.update(id, dto);
    }

    @Delete('users/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softDelete(@Param('id') id: string) {
        await this.service.softDelete(id);
    }

    /**
     * Profile Management Endpoints
     */

    @Get('profile/:id')
    async getProfile(@Param('id') id: string) {
        const user = await this.service.findById(id);
        // Return only safe profile data
        return {
            id: user.id,
            profile: user.profile,
            preferences: user.preferences,
            tenant: user.tenant,
            basicAuth: {
                email: user.basicAuth?.email,
                username: user.basicAuth?.username,
                status: user.basicAuth?.status,
                isVerified: user.basicAuth?.isVerified,
                lastLoginAt: user.basicAuth?.lastLoginAt
            }
        };
    }

    @Put('profile/:id')
    async updateProfile(
        @Param('id') id: string,
        @Body() profileData: { profile?: any; preferences?: any }
    ) {
        const updateDto: UpdateLoginDto = {
            profile: profileData.profile,
            preferences: profileData.preferences
        };
        return await this.service.update(id, updateDto);
    }

    /**
     * Security Management Endpoints
     */

    @Put('security/2fa/enable/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async enableTwoFactor(@Param('id') id: string) {
        const updateDto: UpdateLoginDto = {
            security: {
                twoFactorEnabled: true
            }
        };
        await this.service.update(id, updateDto);
    }

    @Put('security/2fa/disable/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async disableTwoFactor(@Param('id') id: string) {
        const updateDto: UpdateLoginDto = {
            security: {
                twoFactorEnabled: false,
                twoFactorSecret: undefined
            }
        };
        await this.service.update(id, updateDto);
    }

    @Put('security/questions/:id')
    async updateSecurityQuestions(
        @Param('id') id: string,
        @Body() securityData: {
            securityQuestion1?: string;
            securityAnswer1?: string;
            securityQuestion2?: string;
            securityAnswer2?: string;
            securityQuestion3?: string;
            securityAnswer3?: string;
        }
    ) {
        const updateDto: UpdateLoginDto = {
            security: securityData
        };
        return await this.service.update(id, updateDto);
    }

    /**
     * Session Management Endpoints
     */

    @Get('sessions/:id')
    async getUserSessions(@Param('id') id: string) {
        const user = await this.service.findById(id);
        return {
            activeSessions: user.session?.activeSessions || [],
            lastActivity: user.session?.lastActivity,
            deviceInfo: user.session?.deviceInfo
        };
    }

    @Put('sessions/terminate/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async terminateAllSessions(@Param('id') id: string) {
        const updateDto: UpdateLoginDto = {
            session: {
                activeSessions: [],
                isActive: false
            }
        };
        await this.service.update(id, updateDto);
    }

    /**
     * Admin Endpoints
     */

    @Get('admin/users/stats')
    async getUserStats() {
        // This would typically be in an admin service
        const users = await this.service.findAll({ limit: 1000 });
        return {
            total: users.length,
            active: users.filter(u => u.basicAuth?.status === 'active').length,
            pending: users.filter(u => u.basicAuth?.status === 'pending_verification').length,
            locked: users.filter(u => u.basicAuth?.status === 'locked').length,
            socialUsers: users.filter(u => u.social?.linkedProviders?.length > 0).length
        };
    }

    @Put('admin/users/bulk-action')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkUserAction(
        @Body() actionData: {
            action: 'lock' | 'unlock' | 'delete' | 'activate';
            userIds: string[];
        }
    ) {
        for (const userId of actionData.userIds) {
            switch (actionData.action) {
                case 'lock':
                    await this.service.lockAccount(userId);
                    break;
                case 'unlock':
                    await this.service.unlockAccount(userId);
                    break;
                case 'delete':
                    await this.service.softDelete(userId);
                    break;
                case 'activate':
                    const updateDto: UpdateLoginDto = {
                        basicAuth: { status: 'active' as any }
                    };
                    await this.service.update(userId, updateDto);
                    break;
            }
        }
    }
} 