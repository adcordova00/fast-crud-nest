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
enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    CONFIRMED = 'confirmed',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    NO_SHOW = 'no_show',
    RESCHEDULED = 'rescheduled',
    PENDING_CONFIRMATION = 'pending_confirmation'
}

enum AppointmentType {
    CONSULTATION = 'consultation',
    TREATMENT = 'treatment',
    FOLLOW_UP = 'follow_up',
    EMERGENCY = 'emergency',
    ROUTINE = 'routine',
    GROUP_SESSION = 'group_session',
    VIRTUAL = 'virtual',
    HOME_VISIT = 'home_visit'
}

enum ServiceCategory {
    MEDICAL = 'medical',
    DENTAL = 'dental',
    BEAUTY = 'beauty',
    SPA = 'spa',
    FITNESS = 'fitness',
    THERAPY = 'therapy',
    CONSULTATION = 'consultation',
    EDUCATION = 'education',
    LEGAL = 'legal',
    FINANCIAL = 'financial',
    TECHNICAL = 'technical',
    OTHER = 'other'
}

enum ParticipantRole {
    CLIENT = 'client',
    PROVIDER = 'provider',
    ASSISTANT = 'assistant',
    OBSERVER = 'observer',
    TRANSLATOR = 'translator',
    GUARDIAN = 'guardian',
    COMPANION = 'companion'
}

enum LocationType {
    PHYSICAL = 'physical',
    VIRTUAL = 'virtual',
    HOME_VISIT = 'home_visit',
    OUTDOOR = 'outdoor',
    OFFICE = 'office',
    CLINIC = 'clinic',
    HOSPITAL = 'hospital',
    CUSTOMER_LOCATION = 'customer_location'
}

enum RecurrencePattern {
    NONE = 'none',
    DAILY = 'daily',
    WEEKLY = 'weekly',
    BIWEEKLY = 'biweekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
    CUSTOM = 'custom'
}

enum ReminderType {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
    PHONE_CALL = 'phone_call',
    IN_APP = 'in_app',
    WHATSAPP = 'whatsapp'
}

enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    PARTIAL = 'partial',
    REFUNDED = 'refunded',
    PENDING = 'pending',
    FAILED = 'failed',
    CANCELLED = 'cancelled'
}

enum PaymentMethod {
    CASH = 'cash',
    CREDIT_CARD = 'credit_card',
    DEBIT_CARD = 'debit_card',
    BANK_TRANSFER = 'bank_transfer',
    PAYPAL = 'paypal',
    STRIPE = 'stripe',
    INSURANCE = 'insurance',
    GIFT_CARD = 'gift_card'
}

enum TimeSlotStatus {
    AVAILABLE = 'available',
    BOOKED = 'booked',
    BLOCKED = 'blocked',
    BREAK = 'break',
    HOLIDAY = 'holiday',
    MAINTENANCE = 'maintenance'
}

class ScheduleDto {
    @IsOptional() @IsDateString() startDateTime!: string;
    @IsOptional() @IsDateString() endDateTime!: string;
    @IsOptional() @IsNumber() @Min(1) durationMinutes!: number;
    @IsOptional() @IsString() timezone!: string;
    @IsOptional() @IsEnum(AppointmentStatus) status!: AppointmentStatus;
    @IsOptional() @IsEnum(AppointmentType) type!: AppointmentType;
    @IsOptional() @IsNumber() @Min(0) priority!: number; // 0-10 scale
    @IsOptional() @IsBoolean() isAllDay!: boolean;
    @IsOptional() @IsBoolean() isUrgent!: boolean;
    @IsOptional() @IsString() @MaxLength(50) confirmationCode!: string;
    @IsOptional() @IsDateString() bookedAt!: string;
    @IsOptional() @IsDateString() confirmedAt!: string;
    @IsOptional() @IsDateString() checkedInAt!: string;
    @IsOptional() @IsDateString() startedAt!: string;
    @IsOptional() @IsDateString() completedAt!: string;
    @IsOptional() @IsString() @MaxLength(500) cancellationReason!: string;
    @IsOptional() @IsDateString() cancelledAt!: string;
}

class ServiceDto {
    @IsOptional() @IsString() @MaxLength(200) name!: string;
    @IsOptional() @IsString() @MaxLength(500) description!: string;
    @IsOptional() @IsEnum(ServiceCategory) category!: ServiceCategory;
    @IsOptional() @IsString() @MaxLength(100) serviceCode!: string;
    @IsOptional() @IsNumber() @Min(1) defaultDurationMinutes!: number;
    @IsOptional() @IsNumber() @Min(0) price!: number;
    @IsOptional() @IsString() @MaxLength(10) currency!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) requiredResources!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) requiredSkills!: string[];
    @IsOptional() @IsObject() preparation!: {
        instructions?: string[];
        requiredItems?: string[];
        restrictions?: string[];
        timeRequired?: number; // minutes
    };
    @IsOptional() @IsObject() followUp!: {
        required?: boolean;
        suggestedDays?: number;
        instructions?: string;
    };
    @IsOptional() @IsNumber() @Min(0) @Max(5) rating!: number;
    @IsOptional() @IsArray() @IsString({ each: true }) tags!: string[];
}

class ParticipantsDto {
    @IsOptional() @IsArray() participants!: Array<{
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
    @IsOptional() @IsString() primaryClientId!: string;
    @IsOptional() @IsString() primaryProviderId!: string;
    @IsOptional() @IsNumber() @Min(1) maxParticipants!: number;
    @IsOptional() @IsNumber() @Min(1) minParticipants!: number;
    @IsOptional() @IsArray() @IsString({ each: true }) waitingList!: string[];
    @IsOptional() @IsBoolean() allowWalkIns!: boolean;
    @IsOptional() @IsObject() demographics!: {
        ageGroup?: string;
        gender?: string;
        specialNeeds?: string[];
        languages?: string[];
    };
}

class LocationDto {
    @IsOptional() @IsEnum(LocationType) type!: LocationType;
    @IsOptional() @IsString() @MaxLength(200) name!: string;
    @IsOptional() @IsObject() physical!: {
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
    @IsOptional() @IsObject() virtual!: {
        platform?: string; // Zoom, Teams, Google Meet, etc.
        meetingId?: string;
        password?: string;
        url?: string;
        dialInNumber?: string;
        accessCode?: string;
    };
    @IsOptional() @IsArray() @IsString({ each: true }) amenities!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) equipment!: string[];
    @IsOptional() @IsObject() accessibility!: {
        wheelchairAccessible?: boolean;
        parkingAvailable?: boolean;
        publicTransport?: boolean;
        specialAccommodations?: string[];
    };
    @IsOptional() @IsString() @MaxLength(500) directions!: string;
    @IsOptional() @IsString() @MaxLength(500) notes!: string;
}

class RecurrenceDto {
    @IsOptional() @IsEnum(RecurrencePattern) pattern!: RecurrencePattern;
    @IsOptional() @IsNumber() @Min(1) interval!: number; // every X days/weeks/months
    @IsOptional() @IsArray() daysOfWeek!: number[]; // 0-6, Sunday=0
    @IsOptional() @IsNumber() @Min(1) @Max(31) dayOfMonth!: number;
    @IsOptional() @IsDateString() endDate!: string;
    @IsOptional() @IsNumber() @Min(1) occurrences!: number;
    @IsOptional() @IsArray() exceptions!: string[]; // dates to skip
    @IsOptional() @IsArray() additions!: string[]; // extra dates
    @IsOptional() @IsObject() customRule!: {
        type?: string;
        parameters?: Record<string, any>;
    };
    @IsOptional() @IsBoolean() adjustForHolidays!: boolean;
    @IsOptional() @IsBoolean() adjustForWeekends!: boolean;
}

class RemindersDto {
    @IsOptional() @IsArray() reminders!: Array<{
        type: ReminderType;
        minutesBefore: number;
        message?: string;
        enabled: boolean;
        sent?: boolean;
        sentAt?: string;
    }>;
    @IsOptional() @IsObject() defaultReminders!: {
        client?: Array<{ type: ReminderType; minutesBefore: number }>;
        provider?: Array<{ type: ReminderType; minutesBefore: number }>;
    };
    @IsOptional() @IsBoolean() allowCustomization!: boolean;
    @IsOptional() @IsObject() preferences!: {
        preferredMethod?: ReminderType;
        optOut?: boolean;
        customMessage?: string;
    };
    @IsOptional() @IsObject() automation!: {
        confirmationRequired?: boolean;
        autoCancel?: boolean;
        followUpReminders?: boolean;
    };
}

class PaymentDto {
    @IsOptional() @IsNumber() @Min(0) totalAmount!: number;
    @IsOptional() @IsNumber() @Min(0) paidAmount!: number;
    @IsOptional() @IsNumber() @Min(0) depositAmount!: number;
    @IsOptional() @IsString() @MaxLength(10) currency!: string;
    @IsOptional() @IsEnum(PaymentStatus) status!: PaymentStatus;
    @IsOptional() @IsEnum(PaymentMethod) method!: PaymentMethod;
    @IsOptional() @IsString() transactionId!: string;
    @IsOptional() @IsDateString() paidAt!: string;
    @IsOptional() @IsDateString() dueDate!: string;
    @IsOptional() @IsObject() billing!: {
        invoiceNumber?: string;
        billingAddress?: string;
        taxAmount?: number;
        discountAmount?: number;
        discountCode?: string;
    };
    @IsOptional() @IsObject() refund!: {
        amount?: number;
        reason?: string;
        processedAt?: string;
        refundId?: string;
    };
    @IsOptional() @IsObject() insurance!: {
        provider?: string;
        policyNumber?: string;
        copayAmount?: number;
        preAuthCode?: string;
        claimNumber?: string;
    };
}

class AvailabilityDto {
    @IsOptional() @IsArray() timeSlots!: Array<{
        startTime: string;
        endTime: string;
        status: TimeSlotStatus;
        capacity?: number;
        booked?: number;
        price?: number;
    }>;
    @IsOptional() @IsObject() businessHours!: {
        monday?: { start: string; end: string; available: boolean };
        tuesday?: { start: string; end: string; available: boolean };
        wednesday?: { start: string; end: string; available: boolean };
        thursday?: { start: string; end: string; available: boolean };
        friday?: { start: string; end: string; available: boolean };
        saturday?: { start: string; end: string; available: boolean };
        sunday?: { start: string; end: string; available: boolean };
    };
    @IsOptional() @IsArray() holidays!: string[];
    @IsOptional() @IsArray() blackoutDates!: string[];
    @IsOptional() @IsObject() rules!: {
        advanceBookingDays?: number;
        cancellationDeadlineHours?: number;
        rescheduleDeadlineHours?: number;
        maxBookingsPerDay?: number;
        bufferTimeMinutes?: number;
    };
    @IsOptional() @IsObject() capacity!: {
        total?: number;
        available?: number;
        waitingList?: number;
        overbook?: boolean;
        overbookLimit?: number;
    };
}

class MetadataDto {
    @IsOptional() @IsString() @MaxLength(1000) notes!: string;
    @IsOptional() @IsString() @MaxLength(1000) privateNotes!: string;
    @IsOptional() @IsArray() attachments!: Array<{
        url: string;
        name: string;
        type: string;
        size?: number;
        uploadedAt?: string;
        uploadedBy?: string;
    }>;
    @IsOptional() @IsObject() customFields!: Record<string, any>;
    @IsOptional() @IsArray() @IsString({ each: true }) tags!: string[];
    @IsOptional() @IsObject() tracking!: {
        source?: string; // website, phone, referral, etc.
        campaign?: string;
        referredBy?: string;
        utmParameters?: Record<string, string>;
    };
    @IsOptional() @IsObject() history!: Array<{
        action: string;
        timestamp: string;
        userId?: string;
        details?: string;
        oldValue?: any;
        newValue?: any;
    }>;
    @IsOptional() @IsObject() integration!: {
        externalId?: string;
        syncedWith?: string[];
        lastSyncAt?: string;
        syncStatus?: 'synced' | 'pending' | 'failed';
    };
    @IsOptional() @IsObject() quality!: {
        rating?: number; // 1-5 stars
        feedback?: string;
        completionRate?: number;
        satisfactionScore?: number;
    };
}

export class CreateAppointmentsDto {
    @ValidateNested() @Type(() => ScheduleDto)
    schedule!: ScheduleDto;

    @ValidateNested() @Type(() => ServiceDto)
    service!: ServiceDto;

    @ValidateNested() @Type(() => ParticipantsDto)
    participants!: ParticipantsDto;

    @ValidateNested() @Type(() => LocationDto)
    location!: LocationDto;

    @ValidateNested() @Type(() => RecurrenceDto)
    recurrence!: RecurrenceDto;

    @ValidateNested() @Type(() => RemindersDto)
    reminders!: RemindersDto;

    @ValidateNested() @Type(() => PaymentDto)
    payment!: PaymentDto;

    @ValidateNested() @Type(() => AvailabilityDto)
    availability!: AvailabilityDto;

    @ValidateNested() @Type(() => MetadataDto)
    metadata!: MetadataDto;

    @IsOptional() @IsDateString()
    createdDate!: string;

    @IsOptional() @IsString()
    createdBy!: string;

    @IsOptional() @IsString()
    organizationId!: string;
} 