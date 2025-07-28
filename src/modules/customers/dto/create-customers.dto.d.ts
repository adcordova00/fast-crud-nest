declare enum CustomerType {
    INDIVIDUAL = "individual",
    BUSINESS = "business",
    ENTERPRISE = "enterprise",
    NON_PROFIT = "non_profit",
    GOVERNMENT = "government",
    PARTNER = "partner",
    RESELLER = "reseller",
    DISTRIBUTOR = "distributor"
}
declare enum CustomerStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PENDING = "pending",
    SUSPENDED = "suspended",
    BLOCKED = "blocked",
    VIP = "vip",
    PROSPECT = "prospect",
    LEAD = "lead"
}
declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other",
    PREFER_NOT_TO_SAY = "prefer_not_to_say"
}
declare enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed",
    SEPARATED = "separated",
    DOMESTIC_PARTNERSHIP = "domestic_partnership"
}
declare enum AddressType {
    HOME = "home",
    WORK = "work",
    BILLING = "billing",
    SHIPPING = "shipping",
    MAILING = "mailing",
    OTHER = "other"
}
declare enum BusinessSize {
    STARTUP = "startup",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    ENTERPRISE = "enterprise"
}
declare enum Industry {
    TECHNOLOGY = "technology",
    HEALTHCARE = "healthcare",
    FINANCE = "finance",
    RETAIL = "retail",
    MANUFACTURING = "manufacturing",
    EDUCATION = "education",
    REAL_ESTATE = "real_estate",
    HOSPITALITY = "hospitality",
    AUTOMOTIVE = "automotive",
    LEGAL = "legal",
    CONSULTING = "consulting",
    AGRICULTURE = "agriculture",
    ENERGY = "energy",
    MEDIA = "media",
    NON_PROFIT = "non_profit",
    GOVERNMENT = "government",
    OTHER = "other"
}
declare enum PaymentTerms {
    NET_0 = "net_0",
    NET_15 = "net_15",
    NET_30 = "net_30",
    NET_60 = "net_60",
    NET_90 = "net_90",
    COD = "cod",
    PREPAID = "prepaid",
    CUSTOM = "custom"
}
declare enum CreditRating {
    EXCELLENT = "excellent",
    GOOD = "good",
    FAIR = "fair",
    POOR = "poor",
    NO_CREDIT = "no_credit",
    UNKNOWN = "unknown"
}
declare enum CommunicationPreference {
    EMAIL = "email",
    PHONE = "phone",
    SMS = "sms",
    MAIL = "mail",
    IN_PERSON = "in_person",
    CHAT = "chat",
    NONE = "none"
}
declare enum LoyaltyTier {
    BRONZE = "bronze",
    SILVER = "silver",
    GOLD = "gold",
    PLATINUM = "platinum",
    DIAMOND = "diamond",
    VIP = "vip"
}
declare enum InteractionType {
    CALL = "call",
    EMAIL = "email",
    MEETING = "meeting",
    PURCHASE = "purchase",
    SUPPORT = "support",
    COMPLAINT = "complaint",
    REFERRAL = "referral",
    VISIT = "visit",
    DEMO = "demo",
    QUOTE = "quote"
}
declare enum CustomerSegment {
    HIGH_VALUE = "high_value",
    FREQUENT_BUYER = "frequent_buyer",
    PRICE_SENSITIVE = "price_sensitive",
    QUALITY_FOCUSED = "quality_focused",
    EARLY_ADOPTER = "early_adopter",
    BRAND_LOYAL = "brand_loyal",
    OCCASIONAL_BUYER = "occasional_buyer",
    CHURNED = "churned",
    AT_RISK = "at_risk",
    GROWTH_POTENTIAL = "growth_potential"
}
declare class PersonalDto {
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    title: string;
    suffix: string;
    displayName: string;
    nickname: string;
    dateOfBirth: string;
    gender: Gender;
    maritalStatus: MaritalStatus;
    nationality: string;
    countryOfBirth: string;
    placeOfBirth: string;
    occupation: string;
    jobTitle: string;
    socialSecurityNumber: string;
    passportNumber: string;
    driversLicense: string;
    languages: string[];
    interests: string[];
    hobbies: string[];
}
declare class ContactDto {
    primaryEmail: string;
    secondaryEmail: string;
    workEmail: string;
    primaryPhone: string;
    secondaryPhone: string;
    workPhone: string;
    mobilePhone: string;
    homePhone: string;
    fax: string;
    website: string;
    linkedIn: string;
    facebook: string;
    twitter: string;
    instagram: string;
    skype: string;
    whatsapp: string;
    telegram: string;
    preferredContactMethod: CommunicationPreference;
    preferredContactTime: string;
    timezone: string;
    allowMarketing: boolean;
    allowSms: boolean;
    allowCalls: boolean;
    allowEmails: boolean;
}
declare class AddressDto {
    type: AddressType;
    label: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
    country: string;
    region: string;
    latitude: number;
    longitude: number;
    isPrimary: boolean;
    isValid: boolean;
    lastValidated: string;
    deliveryInstructions: string;
    accessCode: string;
}
declare class BusinessDto {
    companyName: string;
    legalName: string;
    tradingName: string;
    taxId: string;
    vatNumber: string;
    registrationNumber: string;
    dunsNumber: string;
    industry: Industry;
    businessSize: BusinessSize;
    employeeCount: number;
    annualRevenue: number;
    establishedDate: string;
    description: string;
    website: string;
    parentCompany: string;
    subsidiaries: string[];
    businessType: string;
    isPubliclyTraded: boolean;
    stockSymbol: string;
    accountManager: string;
    salesRep: string;
    customFields: Record<string, any>;
}
declare class FinancialDto {
    paymentTerms: PaymentTerms;
    creditLimit: number;
    availableCredit: number;
    outstandingBalance: number;
    creditRating: CreditRating;
    creditScore: number;
    currency: string;
    lifetimeValue: number;
    totalSpent: number;
    averageOrderValue: number;
    lastPaymentDate: string;
    nextPaymentDue: string;
    paymentMethods: Array<{
        type: string;
        lastFour?: string;
        expiry?: string;
        isDefault?: boolean;
        isActive?: boolean;
    }>;
    billingAddress: AddressDto;
    invoiceEmail: string;
    accountingContact: string;
    invoiceDeliveryMethod: string;
    taxes: {
        exemptionNumber?: string;
        isExempt?: boolean;
        exemptionReason?: string;
        taxRate?: number;
    };
    discountRate: number;
    contracts: Array<{
        contractId: string;
        startDate: string;
        endDate: string;
        value: number;
        status: string;
    }>;
}
declare class PreferencesDto {
    language: string;
    locale: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    timeFormat: string;
    preferredContactMethod: CommunicationPreference;
    marketingChannels: string[];
    productInterests: string[];
    serviceInterests: string[];
    notifications: {
        email?: boolean;
        sms?: boolean;
        push?: boolean;
        phone?: boolean;
        marketing?: boolean;
        transactional?: boolean;
        newsletter?: boolean;
        promotions?: boolean;
    };
    privacy: {
        shareData?: boolean;
        allowTracking?: boolean;
        allowCookies?: boolean;
        dataRetention?: string;
    };
    accessibility: {
        needsAssistance?: boolean;
        accessibilityRequirements?: string[];
        preferredFormat?: string;
    };
    customPreferences: Record<string, any>;
}
declare class LoyaltyDto {
    membershipNumber: string;
    tier: LoyaltyTier;
    points: number;
    pointsToNextTier: number;
    memberSince: string;
    tierExpiryDate: string;
    lifetimePoints: number;
    redeemedPoints: number;
    rewards: Array<{
        rewardId: string;
        name: string;
        pointsRequired: number;
        expiryDate?: string;
        status: 'available' | 'redeemed' | 'expired';
    }>;
    earnedBadges: string[];
    referralCount: number;
    referredCustomers: string[];
    referralCode: string;
    satisfactionScore: number;
    npsScore: number;
    lastReviewDate: string;
    isVip: boolean;
    specialOffers: Array<{
        offerId: string;
        name: string;
        description: string;
        validFrom: string;
        validTo: string;
        used: boolean;
    }>;
}
declare class HistoryDto {
    firstContactDate: string;
    lastContactDate: string;
    lastPurchaseDate: string;
    lastLoginDate: string;
    lastActivityDate: string;
    totalOrders: number;
    totalAppointments: number;
    totalSupportTickets: number;
    interactions: Array<{
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
    purchaseHistory: Array<{
        orderId: string;
        date: string;
        amount: number;
        products: string[];
        status: string;
        refunded?: boolean;
        returnedDate?: string;
    }>;
    serviceHistory: Array<{
        serviceId: string;
        date: string;
        type: string;
        provider: string;
        rating?: number;
        feedback?: string;
        completed: boolean;
    }>;
    communicationHistory: Array<{
        id: string;
        type: string;
        date: string;
        subject?: string;
        direction: 'inbound' | 'outbound';
        status: string;
        attachments?: string[];
    }>;
    milestones: Array<{
        milestone: string;
        date: string;
        value?: number;
        description?: string;
    }>;
}
declare class SegmentationDto {
    segments: CustomerSegment[];
    tags: string[];
    categories: string[];
    primarySegment: string;
    scores: {
        engagementScore?: number;
        satisfactionScore?: number;
        loyaltyScore?: number;
        riskScore?: number;
        valueScore?: number;
        behaviourScore?: number;
    };
    analytics: {
        acquisitionChannel?: string;
        conversionSource?: string;
        lastCampaign?: string;
        frequencyScore?: number;
        recencyScore?: number;
        monetaryScore?: number;
        churnProbability?: number;
        lifetimeValuePrediction?: number;
    };
    campaigns: Array<{
        campaignId: string;
        name: string;
        startDate: string;
        endDate?: string;
        response?: 'responded' | 'converted' | 'ignored';
        conversionValue?: number;
    }>;
    personas: {
        primaryPersona?: string;
        secondaryPersonas?: string[];
        buyingBehaviour?: string;
        decisionMakingStyle?: string;
        communicationStyle?: string;
    };
    exclusionLists: string[];
    customSegments: Record<string, any>;
}
export declare class CreateCustomersDto {
    personal: PersonalDto;
    contact: ContactDto;
    addresses: AddressDto[];
    business: BusinessDto;
    financial: FinancialDto;
    preferences: PreferencesDto;
    loyalty: LoyaltyDto;
    history: HistoryDto;
    segmentation: SegmentationDto;
    customerNumber: string;
    customerType: CustomerType;
    status: CustomerStatus;
    source: string;
    assignedTo: string;
    createdDate: string;
    createdBy: string;
    organizationId: string;
}
export {};
