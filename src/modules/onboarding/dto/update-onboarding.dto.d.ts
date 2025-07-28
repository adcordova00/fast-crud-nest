import { CreateOnboardingDto } from './create-onboarding.dto';
type IdentityDto = CreateOnboardingDto['identity'];
type ContactDto = CreateOnboardingDto['contact'];
type AddressDto = CreateOnboardingDto['residentialAddress'];
type PersonalInfoDto = CreateOnboardingDto['personal'];
type EmploymentInfoDto = CreateOnboardingDto['employment'];
type FinancialInfoDto = CreateOnboardingDto['financial'];
type AcademicInfoDto = CreateOnboardingDto['academic'];
type HealthInfoDto = CreateOnboardingDto['health'];
type SecurityDto = CreateOnboardingDto['security'];
type TermsDto = CreateOnboardingDto['terms'];
export declare class UpdateOnboardingDto {
    identity?: Partial<IdentityDto>;
    contact?: Partial<ContactDto>;
    residentialAddress?: Partial<AddressDto>;
    shippingAddress?: Partial<AddressDto>;
    personal?: Partial<PersonalInfoDto>;
    employment?: Partial<EmploymentInfoDto>;
    financial?: Partial<FinancialInfoDto>;
    academic?: Partial<AcademicInfoDto>;
    health?: Partial<HealthInfoDto>;
    security?: Partial<SecurityDto>;
    terms?: Partial<TermsDto>;
    registrationDate?: string;
}
export {};
