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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const login_service_1 = require("./login.service");
const create_login_dto_1 = require("./dto/create-login.dto");
const update_login_dto_1 = require("./dto/update-login.dto");
class LoginCredentialsDto {
}
class SocialLoginDto {
}
class ChangePasswordDto {
}
class ResetPasswordDto {
}
class ForgotPasswordDto {
}
let LoginController = class LoginController {
    constructor(service) {
        this.service = service;
    }
    async register(dto) {
        return await this.service.register(dto);
    }
    async login(credentials) {
        return await this.service.login(credentials.emailOrUsername, credentials.password);
    }
    async socialLogin(socialData) {
        return await this.service.socialLogin(socialData.provider, socialData.socialId, socialData.profileData);
    }
    async socialRegister(socialData) {
        return await this.service.socialRegister(socialData.provider, socialData.socialId, socialData.profileData);
    }
    async changePassword(id, passwordData) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            throw new Error('Passwords do not match');
        }
        await this.service.changePassword(id, passwordData.oldPassword, passwordData.newPassword);
    }
    async resetPassword(resetData) {
        await this.service.resetPassword(resetData.email);
    }
    async forgotPassword(forgotData) {
        await this.service.resetPassword(forgotData.email);
    }
    async lockAccount(id) {
        await this.service.lockAccount(id);
    }
    async unlockAccount(id) {
        await this.service.unlockAccount(id);
    }
    async create(dto) {
        return await this.service.create(dto);
    }
    async findAll(page = 1, limit = 10, search, status, role, provider) {
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
    async findById(id) {
        return await this.service.findById(id);
    }
    async findByEmail(email) {
        return await this.service.findByEmail(email);
    }
    async update(id, dto) {
        return await this.service.update(id, dto);
    }
    async softDelete(id) {
        await this.service.softDelete(id);
    }
    async getProfile(id) {
        const user = await this.service.findById(id);
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
    async updateProfile(id, profileData) {
        const updateDto = {
            profile: profileData.profile,
            preferences: profileData.preferences
        };
        return await this.service.update(id, updateDto);
    }
    async enableTwoFactor(id) {
        const updateDto = {
            security: {
                twoFactorEnabled: true
            }
        };
        await this.service.update(id, updateDto);
    }
    async disableTwoFactor(id) {
        const updateDto = {
            security: {
                twoFactorEnabled: false,
                twoFactorSecret: undefined
            }
        };
        await this.service.update(id, updateDto);
    }
    async updateSecurityQuestions(id, securityData) {
        const updateDto = {
            security: securityData
        };
        return await this.service.update(id, updateDto);
    }
    async getUserSessions(id) {
        const user = await this.service.findById(id);
        return {
            activeSessions: user.session?.activeSessions || [],
            lastActivity: user.session?.lastActivity,
            deviceInfo: user.session?.deviceInfo
        };
    }
    async terminateAllSessions(id) {
        const updateDto = {
            session: {
                activeSessions: [],
                isActive: false
            }
        };
        await this.service.update(id, updateDto);
    }
    async getUserStats() {
        const users = await this.service.findAll({ limit: 1000 });
        return {
            total: users.length,
            active: users.filter(u => u.basicAuth?.status === 'active').length,
            pending: users.filter(u => u.basicAuth?.status === 'pending_verification').length,
            locked: users.filter(u => u.basicAuth?.status === 'locked').length,
            socialUsers: users.filter(u => u.social?.linkedProviders?.length > 0).length
        };
    }
    async bulkUserAction(actionData) {
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
                    const updateDto = {
                        basicAuth: { status: 'active' }
                    };
                    await this.service.update(userId, updateDto);
                    break;
            }
        }
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_login_dto_1.CreateLoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginCredentialsDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('social/login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SocialLoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "socialLogin", null);
__decorate([
    (0, common_1.Post)('social/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SocialLoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "socialRegister", null);
__decorate([
    (0, common_1.Put)('password/change/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Post)('password/reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('password/forgot'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Put)('account/lock/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "lockAccount", null);
__decorate([
    (0, common_1.Put)('account/unlock/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "unlockAccount", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_login_dto_1.CreateLoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('role')),
    __param(5, (0, common_1.Query)('provider')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('users/email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Put)('users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_login_dto_1.UpdateLoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Put)('security/2fa/enable/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "enableTwoFactor", null);
__decorate([
    (0, common_1.Put)('security/2fa/disable/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "disableTwoFactor", null);
__decorate([
    (0, common_1.Put)('security/questions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "updateSecurityQuestions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "getUserSessions", null);
__decorate([
    (0, common_1.Put)('sessions/terminate/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "terminateAllSessions", null);
__decorate([
    (0, common_1.Get)('admin/users/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Put)('admin/users/bulk-action'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "bulkUserAction", null);
exports.LoginController = LoginController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
//# sourceMappingURL=login.controller.js.map