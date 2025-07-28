declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    CONFIRMED = "confirmed",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show",
    RESCHEDULED = "rescheduled",
    PENDING_CONFIRMATION = "pending_confirmation"
}
declare enum AppointmentType {
    CONSULTATION = "consultation",
    TREATMENT = "treatment",
    FOLLOW_UP = "follow_up",
    EMERGENCY = "emergency",
    ROUTINE = "routine",
    GROUP_SESSION = "group_session",
    VIRTUAL = "virtual",
    HOME_VISIT = "home_visit"
}
declare enum ServiceCategory {
    MEDICAL = "medical",
    DENTAL = "dental",
    BEAUTY = "beauty",
    SPA = "spa",
    FITNESS = "fitness",
    THERAPY = "therapy",
    CONSULTATION = "consultation",
    EDUCATION = "education",
    LEGAL = "legal",
    FINANCIAL = "financial",
    TECHNICAL = "technical",
    OTHER = "other"
}
declare enum ParticipantRole {
    CLIENT = "client",
    PROVIDER = "provider",
    ASSISTANT = "assistant",
    OBSERVER = "observer",
    TRANSLATOR = "translator",
    GUARDIAN = "guardian",
    COMPANION = "companion"
}
declare enum LocationType {
    PHYSICAL = "physical",
    VIRTUAL = "virtual",
    HOME_VISIT = "home_visit",
    OUTDOOR = "outdoor",
    OFFICE = "office",
    CLINIC = "clinic",
    HOSPITAL = "hospital",
    CUSTOMER_LOCATION = "customer_location"
}
declare enum RecurrencePattern {
    NONE = "none",
    DAILY = "daily",
    WEEKLY = "weekly",
    BIWEEKLY = "biweekly",
    MONTHLY = "monthly",
    QUARTERLY = "quarterly",
    YEARLY = "yearly",
    CUSTOM = "custom"
}
declare enum ReminderType {
    EMAIL = "email",
    SMS = "sms",
    PUSH = "push",
    PHONE_CALL = "phone_call",
    IN_APP = "in_app",
    WHATSAPP = "whatsapp"
}
declare enum PaymentStatus {
    UNPAID = "unpaid",
    PAID = "paid",
    PARTIAL = "partial",
    REFUNDED = "refunded",
    PENDING = "pending",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
declare enum PaymentMethod {
    CASH = "cash",
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    BANK_TRANSFER = "bank_transfer",
    PAYPAL = "paypal",
    STRIPE = "stripe",
    INSURANCE = "insurance",
    GIFT_CARD = "gift_card"
}
declare enum TimeSlotStatus {
    AVAILABLE = "available",
    BOOKED = "booked",
    BLOCKED = "blocked",
    BREAK = "break",
    HOLIDAY = "holiday",
    MAINTENANCE = "maintenance"
}
declare class ScheduleDto {
    startDateTime: string;
    endDateTime: string;
    durationMinutes: number;
    timezone: string;
    status: AppointmentStatus;
    type: AppointmentType;
    priority: number;
    isAllDay: boolean;
    isUrgent: boolean;
    confirmationCode: string;
    bookedAt: string;
    confirmedAt: string;
    checkedInAt: string;
    startedAt: string;
    completedAt: string;
    cancellationReason: string;
    cancelledAt: string;
}
declare class ServiceDto {
    name: string;
    description: string;
    category: ServiceCategory;
    serviceCode: string;
    defaultDurationMinutes: number;
    price: number;
    currency: string;
    requiredResources: string[];
    requiredSkills: string[];
    preparation: {
        instructions?: string[];
        requiredItems?: string[];
        restrictions?: string[];
        timeRequired?: number;
    };
    followUp: {
        required?: boolean;
        suggestedDays?: number;
        instructions?: string;
    };
    rating: number;
    tags: string[];
}
declare class ParticipantsDto {
    participants: Array<{
        id?: string;
        role: ParticipantRole;
        name: string;
        email?: string;
        phone?: string;
        isRequired: boolean;
        confirmed?: boolean;
        checkedIn?: boolean;
        notes?: string;
    }>;
    primaryClientId: string;
    primaryProviderId: string;
    maxParticipants: number;
    minParticipants: number;
    waitingList: string[];
    allowWalkIns: boolean;
    demographics: {
        ageGroup?: string;
        gender?: string;
        specialNeeds?: string[];
        languages?: string[];
    };
}
declare class LocationDto {
    type: LocationType;
    name: string;
    physical: {
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
        building?: string;
        floor?: string;
        room?: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    virtual: {
        platform?: string;
        meetingId?: string;
        password?: string;
        url?: string;
        dialInNumber?: string;
        accessCode?: string;
    };
    amenities: string[];
    equipment: string[];
    accessibility: {
        wheelchairAccessible?: boolean;
        parkingAvailable?: boolean;
        publicTransport?: boolean;
        specialAccommodations?: string[];
    };
    directions: string;
    notes: string;
}
declare class RecurrenceDto {
    pattern: RecurrencePattern;
    interval: number;
    daysOfWeek: number[];
    dayOfMonth: number;
    endDate: string;
    occurrences: number;
    exceptions: string[];
    additions: string[];
    customRule: {
        type?: string;
        parameters?: Record<string, any>;
    };
    adjustForHolidays: boolean;
    adjustForWeekends: boolean;
}
declare class RemindersDto {
    reminders: Array<{
        type: ReminderType;
        minutesBefore: number;
        message?: string;
        enabled: boolean;
        sent?: boolean;
        sentAt?: string;
    }>;
    defaultReminders: {
        client?: Array<{
            type: ReminderType;
            minutesBefore: number;
        }>;
        provider?: Array<{
            type: ReminderType;
            minutesBefore: number;
        }>;
    };
    allowCustomization: boolean;
    preferences: {
        preferredMethod?: ReminderType;
        optOut?: boolean;
        customMessage?: string;
    };
    automation: {
        confirmationRequired?: boolean;
        autoCancel?: boolean;
        followUpReminders?: boolean;
    };
}
declare class PaymentDto {
    totalAmount: number;
    paidAmount: number;
    depositAmount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId: string;
    paidAt: string;
    dueDate: string;
    billing: {
        invoiceNumber?: string;
        billingAddress?: string;
        taxAmount?: number;
        discountAmount?: number;
        discountCode?: string;
    };
    refund: {
        amount?: number;
        reason?: string;
        processedAt?: string;
        refundId?: string;
    };
    insurance: {
        provider?: string;
        policyNumber?: string;
        copayAmount?: number;
        preAuthCode?: string;
        claimNumber?: string;
    };
}
declare class AvailabilityDto {
    timeSlots: Array<{
        startTime: string;
        endTime: string;
        status: TimeSlotStatus;
        capacity?: number;
        booked?: number;
        price?: number;
    }>;
    businessHours: {
        monday?: {
            start: string;
            end: string;
            available: boolean;
        };
        tuesday?: {
            start: string;
            end: string;
            available: boolean;
        };
        wednesday?: {
            start: string;
            end: string;
            available: boolean;
        };
        thursday?: {
            start: string;
            end: string;
            available: boolean;
        };
        friday?: {
            start: string;
            end: string;
            available: boolean;
        };
        saturday?: {
            start: string;
            end: string;
            available: boolean;
        };
        sunday?: {
            start: string;
            end: string;
            available: boolean;
        };
    };
    holidays: string[];
    blackoutDates: string[];
    rules: {
        advanceBookingDays?: number;
        cancellationDeadlineHours?: number;
        rescheduleDeadlineHours?: number;
        maxBookingsPerDay?: number;
        bufferTimeMinutes?: number;
    };
    capacity: {
        total?: number;
        available?: number;
        waitingList?: number;
        overbook?: boolean;
        overbookLimit?: number;
    };
}
declare class MetadataDto {
    notes: string;
    privateNotes: string;
    attachments: Array<{
        url: string;
        name: string;
        type: string;
        size?: number;
        uploadedAt?: string;
        uploadedBy?: string;
    }>;
    customFields: Record<string, any>;
    tags: string[];
    tracking: {
        source?: string;
        campaign?: string;
        referredBy?: string;
        utmParameters?: Record<string, string>;
    };
    history: Array<{
        action: string;
        timestamp: string;
        userId?: string;
        details?: string;
        oldValue?: any;
        newValue?: any;
    }>;
    integration: {
        externalId?: string;
        syncedWith?: string[];
        lastSyncAt?: string;
        syncStatus?: 'synced' | 'pending' | 'failed';
    };
    quality: {
        rating?: number;
        feedback?: string;
        completionRate?: number;
        satisfactionScore?: number;
    };
}
export declare class CreateAppointmentsDto {
    schedule: ScheduleDto;
    service: ServiceDto;
    participants: ParticipantsDto;
    location: LocationDto;
    recurrence: RecurrenceDto;
    reminders: RemindersDto;
    payment: PaymentDto;
    availability: AvailabilityDto;
    metadata: MetadataDto;
    createdDate: string;
    createdBy: string;
    organizationId: string;
}
export {};
