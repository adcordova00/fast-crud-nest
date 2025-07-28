import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
declare class LoginCredentialsDto {
    emailOrUsername: string;
    password: string;
    rememberMe?: boolean;
    deviceInfo?: string;
}
declare class SocialLoginDto {
    provider: string;
    accessToken: string;
    socialId: string;
    profileData?: any;
}
declare class ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
declare class ResetPasswordDto {
    email: string;
}
declare class ForgotPasswordDto {
    email: string;
}
export declare class LoginController {
    private readonly service;
    constructor(service: LoginService);
    register(dto: CreateLoginDto): Promise<any>;
    login(credentials: LoginCredentialsDto): Promise<any>;
    socialLogin(socialData: SocialLoginDto): Promise<any>;
    socialRegister(socialData: SocialLoginDto): Promise<any>;
    changePassword(id: string, passwordData: ChangePasswordDto): Promise<void>;
    resetPassword(resetData: ResetPasswordDto): Promise<void>;
    forgotPassword(forgotData: ForgotPasswordDto): Promise<void>;
    lockAccount(id: string): Promise<void>;
    unlockAccount(id: string): Promise<void>;
    create(dto: CreateLoginDto): Promise<any>;
    findAll(page?: number, limit?: number, search?: string, status?: string, role?: string, provider?: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    update(id: string, dto: UpdateLoginDto): Promise<any>;
    softDelete(id: string): Promise<void>;
    getProfile(id: string): Promise<{
        id: any;
        profile: any;
        preferences: any;
        tenant: any;
        basicAuth: {
            email: any;
            username: any;
            status: any;
            isVerified: any;
            lastLoginAt: any;
        };
    }>;
    updateProfile(id: string, profileData: {
        profile?: any;
        preferences?: any;
    }): Promise<any>;
    enableTwoFactor(id: string): Promise<void>;
    disableTwoFactor(id: string): Promise<void>;
    updateSecurityQuestions(id: string, securityData: {
        securityQuestion1?: string;
        securityAnswer1?: string;
        securityQuestion2?: string;
        securityAnswer2?: string;
        securityQuestion3?: string;
        securityAnswer3?: string;
    }): Promise<any>;
    getUserSessions(id: string): Promise<{
        activeSessions: any;
        lastActivity: any;
        deviceInfo: any;
    }>;
    terminateAllSessions(id: string): Promise<void>;
    getUserStats(): Promise<{
        total: number;
        active: number;
        pending: number;
        locked: number;
        socialUsers: number;
    }>;
    bulkUserAction(actionData: {
        action: 'lock' | 'unlock' | 'delete' | 'activate';
        userIds: string[];
    }): Promise<void>;
}
export {};
