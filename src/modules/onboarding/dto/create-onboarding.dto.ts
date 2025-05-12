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
} from 'class-validator';
import { Type } from 'class-transformer';

class IdentityDto {
    @IsOptional() @IsString() documentType!: string;
    @IsOptional() @IsString() documentNumber!: string;
    @IsOptional() @IsDateString() issueDate!: string;
    @IsOptional() @IsDateString() expirationDate!: string;
    @IsOptional() @IsString() nationality!: string;
    @IsOptional() @IsString() countryOfBirth!: string;
    @IsOptional() @IsString() placeOfBirth!: string;
}

class ContactDto {
    @IsOptional() @IsEmail() email!: string;
    @IsOptional() @IsPhoneNumber() phone!: string;
    @IsOptional() @IsPhoneNumber() secondaryPhone!: string;
}

class AddressDto {
    @IsOptional() @IsString() street!: string;
    @IsOptional() @IsString() number!: string;
    @IsOptional() @IsString() neighborhood!: string;
    @IsOptional() @IsString() city!: string;
    @IsOptional() @IsString() state!: string;
    @IsOptional() @IsString() zipCode!: string;
    @IsOptional() @IsString() country!: string;
}

class PersonalInfoDto {
    @IsOptional() @IsString() firstName!: string;
    @IsOptional() @IsString() lastName!: string;
    @IsOptional() @IsString() middleName!: string;
    @IsOptional() @IsDateString() dateOfBirth!: string;
    @IsOptional() @IsString() gender!: string;
    @IsOptional() @IsString() maritalStatus!: string;
    @IsOptional() @IsString() nationality!: string;
}

class EmploymentInfoDto {
    @IsOptional() @IsString() occupation!: string;
    @IsOptional() @IsString() companyName!: string;
    @IsOptional() @IsString() companyAddress!: string;
    @IsOptional() @IsString() position!: string;
    @IsOptional() @IsNumber() yearsOfExperience!: number;
}

class FinancialInfoDto {
    @IsOptional() @IsNumber() monthlyIncome!: number;
    @IsOptional() @IsNumber() monthlyExpenses!: number;
    @IsOptional() @IsString() bankName!: string;
    @IsOptional() @IsString() accountType!: string;
    @IsOptional() @IsString() accountNumber!: string;
}

class AcademicInfoDto {
    @IsOptional() @IsString() highestDegree!: string;
    @IsOptional() @IsString() institutionName!: string;
    @IsOptional() @IsDateString() graduationDate!: string;
}

class HealthInfoDto {
    @IsOptional() @IsString() bloodType!: string;
    @IsOptional() @IsString() allergies!: string;
    @IsOptional() @IsBoolean() hasChronicIllness!: boolean;
}

class SecurityDto {
    @IsOptional() @IsString() securityQuestion!: string;
    @IsOptional() @IsString() securityAnswer!: string;
    @IsOptional() @IsString() pin!: string;
}

class TermsDto {
    @IsOptional() @IsBoolean() acceptedTerms!: boolean;
    @IsOptional() @IsBoolean() acceptedPrivacyPolicy!: boolean;
    @IsOptional() @IsDateString() acceptedAt!: string;
}

export class CreateOnboardingDto {
    @ValidateNested() @Type(() => IdentityDto)
    identity!: IdentityDto;

    @ValidateNested() @Type(() => ContactDto)
    contact!: ContactDto;

    @ValidateNested() @Type(() => AddressDto)
    residentialAddress!: AddressDto;

    @ValidateNested() @Type(() => AddressDto)
    shippingAddress!: AddressDto;

    @ValidateNested() @Type(() => PersonalInfoDto)
    personal!: PersonalInfoDto;

    @ValidateNested() @Type(() => EmploymentInfoDto)
    employment!: EmploymentInfoDto;

    @ValidateNested() @Type(() => FinancialInfoDto)
    financial!: FinancialInfoDto;

    @ValidateNested() @Type(() => AcademicInfoDto)
    academic!: AcademicInfoDto;

    @ValidateNested() @Type(() => HealthInfoDto)
    health!: HealthInfoDto;

    @ValidateNested() @Type(() => SecurityDto)
    security!: SecurityDto;

    @ValidateNested() @Type(() => TermsDto)
    terms!: TermsDto;

    @IsOptional() @IsDateString()
    registrationDate!: string;
}
