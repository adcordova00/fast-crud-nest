declare class IdentityDto {
    documentType: string;
    documentNumber: string;
    issueDate: string;
    expirationDate: string;
    nationality: string;
    countryOfBirth: string;
    placeOfBirth: string;
}
declare class ContactDto {
    email: string;
    phone: string;
    secondaryPhone: string;
}
declare class AddressDto {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
declare class PersonalInfoDto {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    nationality: string;
}
declare class EmploymentInfoDto {
    occupation: string;
    companyName: string;
    companyAddress: string;
    position: string;
    yearsOfExperience: number;
}
declare class FinancialInfoDto {
    monthlyIncome: number;
    monthlyExpenses: number;
    bankName: string;
    accountType: string;
    accountNumber: string;
}
declare class AcademicInfoDto {
    highestDegree: string;
    institutionName: string;
    graduationDate: string;
}
declare class HealthInfoDto {
    bloodType: string;
    allergies: string;
    hasChronicIllness: boolean;
}
declare class SecurityDto {
    securityQuestion: string;
    securityAnswer: string;
    pin: string;
}
declare class TermsDto {
    acceptedTerms: boolean;
    acceptedPrivacyPolicy: boolean;
    acceptedAt: string;
}
export declare class CreateOnboardingDto {
    identity: IdentityDto;
    contact: ContactDto;
    residentialAddress: AddressDto;
    shippingAddress: AddressDto;
    personal: PersonalInfoDto;
    employment: EmploymentInfoDto;
    financial: FinancialInfoDto;
    academic: AcademicInfoDto;
    health: HealthInfoDto;
    security: SecurityDto;
    terms: TermsDto;
    registrationDate: string;
}
export {};
