import { CreateLoginDto } from './create-login.dto';
type BasicAuthDto = CreateLoginDto['basicAuth'];
type ProfileDto = CreateLoginDto['profile'];
type SecurityDto = CreateLoginDto['security'];
type SocialDto = CreateLoginDto['social'];
type PreferencesDto = CreateLoginDto['preferences'];
type TenantDto = CreateLoginDto['tenant'];
type SessionDto = CreateLoginDto['session'];
type TermsDto = CreateLoginDto['terms'];
export declare class UpdateLoginDto {
    basicAuth?: Partial<BasicAuthDto>;
    profile?: Partial<ProfileDto>;
    security?: Partial<SecurityDto>;
    social?: Partial<SocialDto>;
    preferences?: Partial<PreferencesDto>;
    tenant?: Partial<TenantDto>;
    session?: Partial<SessionDto>;
    terms?: Partial<TermsDto>;
    registrationDate?: string;
    referralCode?: string;
    invitedBy?: string;
}
export {};
