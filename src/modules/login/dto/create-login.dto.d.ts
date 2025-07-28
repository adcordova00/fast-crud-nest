declare enum AuthProvider {
    LOCAL = "local",
    GOOGLE = "google",
    FACEBOOK = "facebook",
    GITHUB = "github",
    MICROSOFT = "microsoft",
    APPLE = "apple",
    LINKEDIN = "linkedin",
    TWITTER = "twitter"
}
declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator",
    GUEST = "guest",
    SUPER_ADMIN = "super_admin"
}
declare enum AccountStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    PENDING_VERIFICATION = "pending_verification",
    LOCKED = "locked"
}
declare enum NotificationPreference {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    IN_APP = "in_app",
    NONE = "none"
}
declare class BasicAuthDto {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    passwordHash: string;
    salt: string;
    primaryProvider: AuthProvider;
    status: AccountStatus;
    isVerified: boolean;
    lastPasswordChange: string;
    passwordAttempts: number;
    lastLoginAt: string;
}
declare class ProfileDto {
    firstName: string;
    lastName: string;
    middleName: string;
    displayName: string;
    avatar: string;
    bio: string;
    dateOfBirth: string;
    gender: string;
    phone: string;
    jobTitle: string;
    company: string;
    department: string;
    website: string;
    timezone: string;
    locale: string;
}
declare class SecurityDto {
    twoFactorEnabled: boolean;
    twoFactorSecret: string;
    backupCodes: string[];
    securityQuestion1: string;
    securityAnswer1: string;
    securityQuestion2: string;
    securityAnswer2: string;
    securityQuestion3: string;
    securityAnswer3: string;
    loginAttempts: number;
    lockedUntil: string;
    requirePasswordChange: boolean;
    trustedDevices: string[];
    pin: string;
}
declare class SocialDto {
    googleId: string;
    facebookId: string;
    githubId: string;
    microsoftId: string;
    appleId: string;
    linkedinId: string;
    twitterId: string;
    linkedProviders: AuthProvider[];
    providerData: Record<string, any>;
    socialAvatar: string;
    allowSocialLogin: boolean;
}
declare class PreferencesDto {
    language: string;
    theme: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    notificationMethods: NotificationPreference[];
    showOnlineStatus: boolean;
    allowDataCollection: boolean;
    customSettings: Record<string, any>;
}
declare class TenantDto {
    organizationId: string;
    organizationName: string;
    role: UserRole;
    permissions: string[];
    groups: string[];
    department: string;
    managerId: string;
    subordinates: string[];
    tenantSettings: Record<string, any>;
    isActive: boolean;
    joinedAt: string;
    leftAt: string;
}
declare class SessionDto {
    deviceId: string;
    deviceName: string;
    deviceType: string;
    ipAddress: string;
    userAgent: string;
    browser: string;
    operatingSystem: string;
    location: string;
    lastActivity: string;
    isActive: boolean;
    refreshToken: string;
    refreshTokenExpiry: string;
    activeSessions: string[];
    maxConcurrentSessions: number;
}
declare class TermsDto {
    acceptedTerms: boolean;
    acceptedPrivacyPolicy: boolean;
    acceptedCookiePolicy: boolean;
    acceptedMarketingTerms: boolean;
    termsAcceptedAt: string;
    termsVersion: string;
    privacyPolicyVersion: string;
    ipAddressAtAcceptance: string;
}
export declare class CreateLoginDto {
    basicAuth: BasicAuthDto;
    profile: ProfileDto;
    security: SecurityDto;
    social: SocialDto;
    preferences: PreferencesDto;
    tenant: TenantDto;
    session: SessionDto;
    terms: TermsDto;
    registrationDate: string;
    referralCode: string;
    invitedBy: string;
}
export {};
