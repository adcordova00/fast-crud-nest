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
    Min,
    Max,
    IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums for better type safety
enum CustomerType {
    INDIVIDUAL = 'individual',
    BUSINESS = 'business',
    ENTERPRISE = 'enterprise',
    NON_PROFIT = 'non_profit',
    GOVERNMENT = 'government',
    PARTNER = 'partner',
    RESELLER = 'reseller',
    DISTRIBUTOR = 'distributor'
}

enum CustomerStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    SUSPENDED = 'suspended',
    BLOCKED = 'blocked',
    VIP = 'vip',
    PROSPECT = 'prospect',
    LEAD = 'lead'
}

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
    SEPARATED = 'separated',
    DOMESTIC_PARTNERSHIP = 'domestic_partnership'
}

enum AddressType {
    HOME = 'home',
    WORK = 'work',
    BILLING = 'billing',
    SHIPPING = 'shipping',
    MAILING = 'mailing',
    OTHER = 'other'
}

enum BusinessSize {
    STARTUP = 'startup',
    SMALL = 'small',
    MEDIUM = 'medium',
    LARGE = 'large',
    ENTERPRISE = 'enterprise'
}

enum Industry {
    TECHNOLOGY = 'technology',
    HEALTHCARE = 'healthcare',
    FINANCE = 'finance',
    RETAIL = 'retail',
    MANUFACTURING = 'manufacturing',
    EDUCATION = 'education',
    REAL_ESTATE = 'real_estate',
    HOSPITALITY = 'hospitality',
    AUTOMOTIVE = 'automotive',
    LEGAL = 'legal',
    CONSULTING = 'consulting',
    AGRICULTURE = 'agriculture',
    ENERGY = 'energy',
    MEDIA = 'media',
    NON_PROFIT = 'non_profit',
    GOVERNMENT = 'government',
    OTHER = 'other'
}

enum PaymentTerms {
    NET_0 = 'net_0',
    NET_15 = 'net_15',
    NET_30 = 'net_30',
    NET_60 = 'net_60',
    NET_90 = 'net_90',
    COD = 'cod',
    PREPAID = 'prepaid',
    CUSTOM = 'custom'
}

enum CreditRating {
    EXCELLENT = 'excellent',
    GOOD = 'good',
    FAIR = 'fair',
    POOR = 'poor',
    NO_CREDIT = 'no_credit',
    UNKNOWN = 'unknown'
}

enum CommunicationPreference {
    EMAIL = 'email',
    PHONE = 'phone',
    SMS = 'sms',
    MAIL = 'mail',
    IN_PERSON = 'in_person',
    CHAT = 'chat',
    NONE = 'none'
}

enum LoyaltyTier {
    BRONZE = 'bronze',
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum',
    DIAMOND = 'diamond',
    VIP = 'vip'
}

enum InteractionType {
    CALL = 'call',
    EMAIL = 'email',
    MEETING = 'meeting',
    PURCHASE = 'purchase',
    SUPPORT = 'support',
    COMPLAINT = 'complaint',
    REFERRAL = 'referral',
    VISIT = 'visit',
    DEMO = 'demo',
    QUOTE = 'quote'
}

enum CustomerSegment {
    HIGH_VALUE = 'high_value',
    FREQUENT_BUYER = 'frequent_buyer',
    PRICE_SENSITIVE = 'price_sensitive',
    QUALITY_FOCUSED = 'quality_focused',
    EARLY_ADOPTER = 'early_adopter',
    BRAND_LOYAL = 'brand_loyal',
    OCCASIONAL_BUYER = 'occasional_buyer',
    CHURNED = 'churned',
    AT_RISK = 'at_risk',
    GROWTH_POTENTIAL = 'growth_potential'
}

class PersonalDto {
    @IsOptional() @IsString() @MaxLength(50) firstName!: string;
    @IsOptional() @IsString() @MaxLength(50) lastName!: string;
    @IsOptional() @IsString() @MaxLength(50) middleName!: string;
    @IsOptional() @IsString() @MaxLength(100) fullName!: string;
    @IsOptional() @IsString() @MaxLength(20) title!: string; // Mr, Mrs, Dr, etc.
    @IsOptional() @IsString() @MaxLength(50) suffix!: string; // Jr, Sr, III, etc.
    @IsOptional() @IsString() @MaxLength(100) displayName!: string;
    @IsOptional() @IsString() @MaxLength(50) nickname!: string;
    @IsOptional() @IsDateString() dateOfBirth!: string;
    @IsOptional() @IsEnum(Gender) gender!: Gender;
    @IsOptional() @IsEnum(MaritalStatus) maritalStatus!: MaritalStatus;
    @IsOptional() @IsString() @MaxLength(50) nationality!: string;
    @IsOptional() @IsString() @MaxLength(50) countryOfBirth!: string;
    @IsOptional() @IsString() @MaxLength(50) placeOfBirth!: string;
    @IsOptional() @IsString() @MaxLength(100) occupation!: string;
    @IsOptional() @IsString() @MaxLength(100) jobTitle!: string;
    @IsOptional() @IsString() @MaxLength(20) socialSecurityNumber!: string;
    @IsOptional() @IsString() @MaxLength(50) passportNumber!: string;
    @IsOptional() @IsString() @MaxLength(50) driversLicense!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) languages!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) interests!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) hobbies!: string[];
}

class ContactDto {
    @IsOptional() @IsEmail() primaryEmail!: string;
    @IsOptional() @IsEmail() secondaryEmail!: string;
    @IsOptional() @IsEmail() workEmail!: string;
    @IsOptional() @IsPhoneNumber() primaryPhone!: string;
    @IsOptional() @IsPhoneNumber() secondaryPhone!: string;
    @IsOptional() @IsPhoneNumber() workPhone!: string;
    @IsOptional() @IsPhoneNumber() mobilePhone!: string;
    @IsOptional() @IsPhoneNumber() homePhone!: string;
    @IsOptional() @IsPhoneNumber() fax!: string;
    @IsOptional() @IsUrl() website!: string;
    @IsOptional() @IsUrl() linkedIn!: string;
    @IsOptional() @IsUrl() facebook!: string;
    @IsOptional() @IsUrl() twitter!: string;
    @IsOptional() @IsUrl() instagram!: string;
    @IsOptional() @IsString() @MaxLength(50) skype!: string;
    @IsOptional() @IsString() @MaxLength(50) whatsapp!: string;
    @IsOptional() @IsString() @MaxLength(50) telegram!: string;
    @IsOptional() @IsEnum(CommunicationPreference) preferredContactMethod!: CommunicationPreference;
    @IsOptional() @IsString() @MaxLength(100) preferredContactTime!: string;
    @IsOptional() @IsString() @MaxLength(50) timezone!: string;
    @IsOptional() @IsBoolean() allowMarketing!: boolean;
    @IsOptional() @IsBoolean() allowSms!: boolean;
    @IsOptional() @IsBoolean() allowCalls!: boolean;
    @IsOptional() @IsBoolean() allowEmails!: boolean;
}

class AddressDto {
    @IsOptional() @IsEnum(AddressType) type!: AddressType;
    @IsOptional() @IsString() @MaxLength(200) label!: string;
    @IsOptional() @IsString() @MaxLength(500) street1!: string;
    @IsOptional() @IsString() @MaxLength(500) street2!: string;
    @IsOptional() @IsString() @MaxLength(100) city!: string;
    @IsOptional() @IsString() @MaxLength(100) state!: string;
    @IsOptional() @IsString() @MaxLength(20) zipCode!: string;
    @IsOptional() @IsString() @MaxLength(100) county!: string;
    @IsOptional() @IsString() @MaxLength(100) country!: string;
    @IsOptional() @IsString() @MaxLength(50) region!: string;
    @IsOptional() @IsNumber() latitude!: number;
    @IsOptional() @IsNumber() longitude!: number;
    @IsOptional() @IsBoolean() isPrimary!: boolean;
    @IsOptional() @IsBoolean() isValid!: boolean;
    @IsOptional() @IsDateString() lastValidated!: string;
    @IsOptional() @IsString() @MaxLength(500) deliveryInstructions!: string;
    @IsOptional() @IsString() @MaxLength(200) accessCode!: string;
}

class BusinessDto {
    @IsOptional() @IsString() @MaxLength(200) companyName!: string;
    @IsOptional() @IsString() @MaxLength(200) legalName!: string;
    @IsOptional() @IsString() @MaxLength(200) tradingName!: string;
    @IsOptional() @IsString() @MaxLength(50) taxId!: string;
    @IsOptional() @IsString() @MaxLength(50) vatNumber!: string;
    @IsOptional() @IsString() @MaxLength(50) registrationNumber!: string;
    @IsOptional() @IsString() @MaxLength(50) dunsNumber!: string;
    @IsOptional() @IsEnum(Industry) industry!: Industry;
    @IsOptional() @IsEnum(BusinessSize) businessSize!: BusinessSize;
    @IsOptional() @IsNumber() @Min(1) employeeCount!: number;
    @IsOptional() @IsNumber() @Min(0) annualRevenue!: number;
    @IsOptional() @IsDateString() establishedDate!: string;
    @IsOptional() @IsString() @MaxLength(1000) description!: string;
    @IsOptional() @IsUrl() website!: string;
    @IsOptional() @IsString() @MaxLength(200) parentCompany!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) subsidiaries!: string[];
    @IsOptional() @IsString() @MaxLength(100) businessType!: string; // LLC, Corp, Partnership, etc.
    @IsOptional() @IsBoolean() isPubliclyTraded!: boolean;
    @IsOptional() @IsString() @MaxLength(20) stockSymbol!: string;
    @IsOptional() @IsString() @MaxLength(100) accountManager!: string;
    @IsOptional() @IsString() @MaxLength(100) salesRep!: string;
    @IsOptional() @IsObject() customFields!: Record<string, any>;
}

class FinancialDto {
    @IsOptional() @IsEnum(PaymentTerms) paymentTerms!: PaymentTerms;
    @IsOptional() @IsNumber() @Min(0) creditLimit!: number;
    @IsOptional() @IsNumber() @Min(0) availableCredit!: number;
    @IsOptional() @IsNumber() @Min(0) outstandingBalance!: number;
    @IsOptional() @IsEnum(CreditRating) creditRating!: CreditRating;
    @IsOptional() @IsNumber() @Min(300) @Max(850) creditScore!: number;
    @IsOptional() @IsString() @MaxLength(10) currency!: string;
    @IsOptional() @IsNumber() @Min(0) lifetimeValue!: number;
    @IsOptional() @IsNumber() @Min(0) totalSpent!: number;
    @IsOptional() @IsNumber() @Min(0) averageOrderValue!: number;
    @IsOptional() @IsDateString() lastPaymentDate!: string;
    @IsOptional() @IsDateString() nextPaymentDue!: string;
    @IsOptional() @IsArray() paymentMethods!: Array<{
        type: string;
        lastFour?: string;
        expiry?: string;
        isDefault?: boolean;
        isActive?: boolean;
    }>;
    @IsOptional() @IsObject() billingAddress!: AddressDto;
    @IsOptional() @IsString() @MaxLength(100) invoiceEmail!: string;
    @IsOptional() @IsString() @MaxLength(100) accountingContact!: string;
    @IsOptional() @IsString() @MaxLength(50) invoiceDeliveryMethod!: string;
    @IsOptional() @IsObject() taxes!: {
        exemptionNumber?: string;
        isExempt?: boolean;
        exemptionReason?: string;
        taxRate?: number;
    };
    @IsOptional() @IsNumber() @Min(0) @Max(100) discountRate!: number;
    @IsOptional() @IsArray() contracts!: Array<{
        contractId: string;
        startDate: string;
        endDate: string;
        value: number;
        status: string;
    }>;
}

class PreferencesDto {
    @IsOptional() @IsString() @MaxLength(20) language!: string;
    @IsOptional() @IsString() @MaxLength(50) locale!: string;
    @IsOptional() @IsString() @MaxLength(50) timezone!: string;
    @IsOptional() @IsString() @MaxLength(10) currency!: string;
    @IsOptional() @IsString() @MaxLength(50) dateFormat!: string;
    @IsOptional() @IsString() @MaxLength(50) timeFormat!: string;
    @IsOptional() @IsEnum(CommunicationPreference) preferredContactMethod!: CommunicationPreference;
    @IsOptional() @IsArray() @IsString({ each: true }) marketingChannels!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) productInterests!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) serviceInterests!: string[];
    @IsOptional() @IsObject() notifications!: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
        phone?: boolean;
        marketing?: boolean;
        transactional?: boolean;
        newsletter?: boolean;
        promotions?: boolean;
    };
    @IsOptional() @IsObject() privacy!: {
        shareData?: boolean;
        allowTracking?: boolean;
        allowCookies?: boolean;
        dataRetention?: string;
    };
    @IsOptional() @IsObject() accessibility!: {
        needsAssistance?: boolean;
        accessibilityRequirements?: string[];
        preferredFormat?: string;
    };
    @IsOptional() @IsObject() customPreferences!: Record<string, any>;
}

class LoyaltyDto {
    @IsOptional() @IsString() @MaxLength(50) membershipNumber!: string;
    @IsOptional() @IsEnum(LoyaltyTier) tier!: LoyaltyTier;
    @IsOptional() @IsNumber() @Min(0) points!: number;
    @IsOptional() @IsNumber() @Min(0) pointsToNextTier!: number;
    @IsOptional() @IsDateString() memberSince!: string;
    @IsOptional() @IsDateString() tierExpiryDate!: string;
    @IsOptional() @IsNumber() @Min(0) lifetimePoints!: number;
    @IsOptional() @IsNumber() @Min(0) redeemedPoints!: number;
    @IsOptional() @IsArray() rewards!: Array<{
        rewardId: string;
        name: string;
        pointsRequired: number;
        expiryDate?: string;
        status: 'available' | 'redeemed' | 'expired';
    }>;
    @IsOptional() @IsArray() @IsString({ each: true }) earnedBadges!: string[];
    @IsOptional() @IsNumber() @Min(0) referralCount!: number;
    @IsOptional() @IsArray() @IsString({ each: true }) referredCustomers!: string[];
    @IsOptional() @IsString() referralCode!: string;
    @IsOptional() @IsNumber() @Min(0) @Max(5) satisfactionScore!: number;
    @IsOptional() @IsNumber() @Min(0) @Max(10) npsScore!: number;
    @IsOptional() @IsDateString() lastReviewDate!: string;
    @IsOptional() @IsBoolean() isVip!: boolean;
    @IsOptional() @IsArray() specialOffers!: Array<{
        offerId: string;
        name: string;
        description: string;
        validFrom: string;
        validTo: string;
        used: boolean;
    }>;
}

class HistoryDto {
    @IsOptional() @IsDateString() firstContactDate!: string;
    @IsOptional() @IsDateString() lastContactDate!: string;
    @IsOptional() @IsDateString() lastPurchaseDate!: string;
    @IsOptional() @IsDateString() lastLoginDate!: string;
    @IsOptional() @IsDateString() lastActivityDate!: string;
    @IsOptional() @IsNumber() @Min(0) totalOrders!: number;
    @IsOptional() @IsNumber() @Min(0) totalAppointments!: number;
    @IsOptional() @IsNumber() @Min(0) totalSupportTickets!: number;
    @IsOptional() @IsArray() interactions!: Array<{
        id: string;
        type: InteractionType;
        date: string;
        description: string;
        outcome?: string;
        rating?: number;
        agentId?: string;
        channelId?: string;
        duration?: number;
        notes?: string;
    }>;
    @IsOptional() @IsArray() purchaseHistory!: Array<{
        orderId: string;
        date: string;
        amount: number;
        products: string[];
        status: string;
        refunded?: boolean;
        returnedDate?: string;
    }>;
    @IsOptional() @IsArray() serviceHistory!: Array<{
        serviceId: string;
        date: string;
        type: string;
        provider: string;
        rating?: number;
        feedback?: string;
        completed: boolean;
    }>;
    @IsOptional() @IsArray() communicationHistory!: Array<{
        id: string;
        type: string;
        date: string;
        subject?: string;
        direction: 'inbound' | 'outbound';
        status: string;
        attachments?: string[];
    }>;
    @IsOptional() @IsArray() milestones!: Array<{
        milestone: string;
        date: string;
        value?: number;
        description?: string;
    }>;
}

class SegmentationDto {
    @IsOptional() @IsArray() @IsEnum(CustomerSegment, { each: true }) segments!: CustomerSegment[];
    @IsOptional() @IsArray() @IsString({ each: true }) tags!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) categories!: string[];
    @IsOptional() @IsString() @MaxLength(200) primarySegment!: string;
    @IsOptional() @IsObject() scores!: {
        engagementScore?: number;
        satisfactionScore?: number;
        loyaltyScore?: number;
        riskScore?: number;
        valueScore?: number;
        behaviourScore?: number;
    };
    @IsOptional() @IsObject() analytics!: {
        acquisitionChannel?: string;
        conversionSource?: string;
        lastCampaign?: string;
        frequencyScore?: number;
        recencyScore?: number;
        monetaryScore?: number;
        churnProbability?: number;
        lifetimeValuePrediction?: number;
    };
    @IsOptional() @IsArray() campaigns!: Array<{
        campaignId: string;
        name: string;
        startDate: string;
        endDate?: string;
        response?: 'responded' | 'converted' | 'ignored';
        conversionValue?: number;
    }>;
    @IsOptional() @IsObject() personas!: {
        primaryPersona?: string;
        secondaryPersonas?: string[];
        buyingBehaviour?: string;
        decisionMakingStyle?: string;
        communicationStyle?: string;
    };
    @IsOptional() @IsArray() @IsString({ each: true }) exclusionLists!: string[];
    @IsOptional() @IsObject() customSegments!: Record<string, any>;
}

export class CreateCustomersDto {
    @ValidateNested() @Type(() => PersonalDto)
    personal!: PersonalDto;

    @ValidateNested() @Type(() => ContactDto)
    contact!: ContactDto;

    @ValidateNested() @Type(() => AddressDto)
    addresses!: AddressDto[];

    @ValidateNested() @Type(() => BusinessDto)
    business!: BusinessDto;

    @ValidateNested() @Type(() => FinancialDto)
    financial!: FinancialDto;

    @ValidateNested() @Type(() => PreferencesDto)
    preferences!: PreferencesDto;

    @ValidateNested() @Type(() => LoyaltyDto)
    loyalty!: LoyaltyDto;

    @ValidateNested() @Type(() => HistoryDto)
    history!: HistoryDto;

    @ValidateNested() @Type(() => SegmentationDto)
    segmentation!: SegmentationDto;

    // Customer metadata
    @IsOptional() @IsString() @MaxLength(100)
    customerNumber!: string;

    @IsOptional() @IsEnum(CustomerType)
    customerType!: CustomerType;

    @IsOptional() @IsEnum(CustomerStatus)
    status!: CustomerStatus;

    @IsOptional() @IsString() @MaxLength(100)
    source!: string;

    @IsOptional() @IsString() @MaxLength(100)
    assignedTo!: string;

    @IsOptional() @IsDateString()
    createdDate!: string;

    @IsOptional() @IsString()
    createdBy!: string;

    @IsOptional() @IsString()
    organizationId!: string;
} 