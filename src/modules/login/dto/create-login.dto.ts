import {
    IsString,
    IsOptional,
    IsEmail,
    IsPhoneNumber,
    IsBoolean,
    IsDateString,
    IsNumber,
    ValidateNested,
    IsArray,
    IsUrl,
    IsEnum,
    MinLength,
    MaxLength,
    IsUUID,
    IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums for better type safety
enum AuthProvider {
    LOCAL = 'local',
    GOOGLE = 'google',
    FACEBOOK = 'facebook',
    GITHUB = 'github',
    MICROSOFT = 'microsoft',
    APPLE = 'apple',
    LINKEDIN = 'linkedin',
    TWITTER = 'twitter'
}

enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator',
    GUEST = 'guest',
    SUPER_ADMIN = 'super_admin'
}

enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    PENDING_VERIFICATION = 'pending_verification',
    LOCKED = 'locked'
}

enum NotificationPreference {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    IN_APP = 'in_app',
    NONE = 'none'
}

class BasicAuthDto {
    @IsOptional() @IsEmail() email!: string;
    @IsOptional() @IsString() @MinLength(3) @MaxLength(50) username!: string;
    @IsOptional() @IsString() @MinLength(8) @MaxLength(128) password!: string;
    @IsOptional() @IsString() @MinLength(8) @MaxLength(128) confirmPassword!: string;
    @IsOptional() @IsString() passwordHash!: string;
    @IsOptional() @IsString() salt!: string;
    @IsOptional() @IsEnum(AuthProvider) primaryProvider!: AuthProvider;
    @IsOptional() @IsEnum(AccountStatus) status!: AccountStatus;
    @IsOptional() @IsBoolean() isVerified!: boolean;
    @IsOptional() @IsDateString() lastPasswordChange!: string;
    @IsOptional() @IsNumber() passwordAttempts!: number;
    @IsOptional() @IsDateString() lastLoginAt!: string;
}

class ProfileDto {
    @IsOptional() @IsString() @MaxLength(50) firstName!: string;
    @IsOptional() @IsString() @MaxLength(50) lastName!: string;
    @IsOptional() @IsString() @MaxLength(50) middleName!: string;
    @IsOptional() @IsString() @MaxLength(100) displayName!: string;
    @IsOptional() @IsUrl() avatar!: string;
    @IsOptional() @IsString() @MaxLength(500) bio!: string;
    @IsOptional() @IsDateString() dateOfBirth!: string;
    @IsOptional() @IsString() gender!: string;
    @IsOptional() @IsPhoneNumber() phone!: string;
    @IsOptional() @IsString() @MaxLength(100) jobTitle!: string;
    @IsOptional() @IsString() @MaxLength(100) company!: string;
    @IsOptional() @IsString() @MaxLength(100) department!: string;
    @IsOptional() @IsString() website!: string;
    @IsOptional() @IsString() timezone!: string;
    @IsOptional() @IsString() locale!: string;
}

class SecurityDto {
    @IsOptional() @IsBoolean() twoFactorEnabled!: boolean;
    @IsOptional() @IsString() twoFactorSecret!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) backupCodes!: string[];
    @IsOptional() @IsString() @MaxLength(200) securityQuestion1!: string;
    @IsOptional() @IsString() @MaxLength(100) securityAnswer1!: string;
    @IsOptional() @IsString() @MaxLength(200) securityQuestion2!: string;
    @IsOptional() @IsString() @MaxLength(100) securityAnswer2!: string;
    @IsOptional() @IsString() @MaxLength(200) securityQuestion3!: string;
    @IsOptional() @IsString() @MaxLength(100) securityAnswer3!: string;
    @IsOptional() @IsNumber() loginAttempts!: number;
    @IsOptional() @IsDateString() lockedUntil!: string;
    @IsOptional() @IsBoolean() requirePasswordChange!: boolean;
    @IsOptional() @IsArray() @IsString({ each: true }) trustedDevices!: string[];
    @IsOptional() @IsString() @MinLength(4) @MaxLength(8) pin!: string;
}

class SocialDto {
    @IsOptional() @IsString() googleId!: string;
    @IsOptional() @IsString() facebookId!: string;
    @IsOptional() @IsString() githubId!: string;
    @IsOptional() @IsString() microsoftId!: string;
    @IsOptional() @IsString() appleId!: string;
    @IsOptional() @IsString() linkedinId!: string;
    @IsOptional() @IsString() twitterId!: string;
    @IsOptional() @IsArray() @IsEnum(AuthProvider, { each: true }) linkedProviders!: AuthProvider[];
    @IsOptional() @IsObject() providerData!: Record<string, any>;
    @IsOptional() @IsString() socialAvatar!: string;
    @IsOptional() @IsBoolean() allowSocialLogin!: boolean;
}

class PreferencesDto {
    @IsOptional() @IsString() language!: string;
    @IsOptional() @IsString() theme!: string;
    @IsOptional() @IsString() currency!: string;
    @IsOptional() @IsString() dateFormat!: string;
    @IsOptional() @IsString() timeFormat!: string;
    @IsOptional() @IsBoolean() emailNotifications!: boolean;
    @IsOptional() @IsBoolean() smsNotifications!: boolean;
    @IsOptional() @IsBoolean() pushNotifications!: boolean;
    @IsOptional() @IsBoolean() marketingEmails!: boolean;
    @IsOptional() @IsArray() @IsEnum(NotificationPreference, { each: true }) notificationMethods!: NotificationPreference[];
    @IsOptional() @IsBoolean() showOnlineStatus!: boolean;
    @IsOptional() @IsBoolean() allowDataCollection!: boolean;
    @IsOptional() @IsObject() customSettings!: Record<string, any>;
}

class TenantDto {
    @IsOptional() @IsUUID() organizationId!: string;
    @IsOptional() @IsString() @MaxLength(100) organizationName!: string;
    @IsOptional() @IsEnum(UserRole) role!: UserRole;
    @IsOptional() @IsArray() @IsString({ each: true }) permissions!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) groups!: string[];
    @IsOptional() @IsString() department!: string;
    @IsOptional() @IsString() managerId!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) subordinates!: string[];
    @IsOptional() @IsObject() tenantSettings!: Record<string, any>;
    @IsOptional() @IsBoolean() isActive!: boolean;
    @IsOptional() @IsDateString() joinedAt!: string;
    @IsOptional() @IsDateString() leftAt!: string;
}

class SessionDto {
    @IsOptional() @IsString() deviceId!: string;
    @IsOptional() @IsString() deviceName!: string;
    @IsOptional() @IsString() deviceType!: string;
    @IsOptional() @IsString() @MaxLength(45) ipAddress!: string;
    @IsOptional() @IsString() userAgent!: string;
    @IsOptional() @IsString() browser!: string;
    @IsOptional() @IsString() operatingSystem!: string;
    @IsOptional() @IsString() location!: string;
    @IsOptional() @IsDateString() lastActivity!: string;
    @IsOptional() @IsBoolean() isActive!: boolean;
    @IsOptional() @IsString() refreshToken!: string;
    @IsOptional() @IsDateString() refreshTokenExpiry!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) activeSessions!: string[];
    @IsOptional() @IsNumber() maxConcurrentSessions!: number;
}

class TermsDto {
    @IsOptional() @IsBoolean() acceptedTerms!: boolean;
    @IsOptional() @IsBoolean() acceptedPrivacyPolicy!: boolean;
    @IsOptional() @IsBoolean() acceptedCookiePolicy!: boolean;
    @IsOptional() @IsBoolean() acceptedMarketingTerms!: boolean;
    @IsOptional() @IsDateString() termsAcceptedAt!: string;
    @IsOptional() @IsString() termsVersion!: string;
    @IsOptional() @IsString() privacyPolicyVersion!: string;
    @IsOptional() @IsString() ipAddressAtAcceptance!: string;
}

export class CreateLoginDto {
    @ValidateNested() @Type(() => BasicAuthDto)
    basicAuth!: BasicAuthDto;

    @ValidateNested() @Type(() => ProfileDto)
    profile!: ProfileDto;

    @ValidateNested() @Type(() => SecurityDto)
    security!: SecurityDto;

    @ValidateNested() @Type(() => SocialDto)
    social!: SocialDto;

    @ValidateNested() @Type(() => PreferencesDto)
    preferences!: PreferencesDto;

    @ValidateNested() @Type(() => TenantDto)
    tenant!: TenantDto;

    @ValidateNested() @Type(() => SessionDto)
    session!: SessionDto;

    @ValidateNested() @Type(() => TermsDto)
    terms!: TermsDto;

    @IsOptional() @IsDateString()
    registrationDate!: string;

    @IsOptional() @IsString()
    referralCode!: string;

    @IsOptional() @IsString()
    invitedBy!: string;
} 