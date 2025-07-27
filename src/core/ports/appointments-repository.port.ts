import { CreateAppointmentsDto } from '../../modules/appointments/dto/create-appointments.dto';

export const APPOINTMENTS_REPOSITORY_PORT = 'AppointmentsRepositoryPort';

export interface AppointmentsRepositoryPort {
    // Standard CRUD operations
    create(data: CreateAppointmentsDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    softDelete(id: string): Promise<void>;

    // Appointment-specific search methods
    findByConfirmationCode(code: string): Promise<any>;
    findByStatus(status: string): Promise<any[]>;
    findByType(type: string): Promise<any[]>;
    findByServiceCode(serviceCode: string): Promise<any[]>;
    findByParticipant(participantId: string, role?: string): Promise<any[]>;
    findByProvider(providerId: string): Promise<any[]>;
    findByClient(clientId: string): Promise<any[]>;

    // Date and time based searches
    findByDateRange(startDate: string, endDate: string, filters?: any): Promise<any[]>;
    findByDate(date: string): Promise<any[]>;
    findUpcoming(participantId?: string, days?: number): Promise<any[]>;
    findPast(participantId?: string, days?: number): Promise<any[]>;
    findToday(providerId?: string): Promise<any[]>;
    findThisWeek(providerId?: string): Promise<any[]>;
    findOverdue(): Promise<any[]>;

    // Schedule management
    checkAvailability(providerId: string, startTime: string, endTime: string): Promise<boolean>;
    findAvailableSlots(providerId: string, date: string, duration: number): Promise<Array<{
        startTime: string;
        endTime: string;
        available: boolean;
    }>>;
    getSchedule(providerId: string, startDate: string, endDate: string): Promise<any[]>;
    findConflicts(providerId: string, startTime: string, endTime: string, excludeId?: string): Promise<any[]>;

    // Status management operations
    confirmAppointment(id: string): Promise<void>;
    cancelAppointment(id: string, reason?: string): Promise<void>;
    rescheduleAppointment(id: string, newStartTime: string, newEndTime: string): Promise<void>;
    checkIn(id: string): Promise<void>;
    checkOut(id: string): Promise<void>;
    markAsStarted(id: string): Promise<void>;
    markAsCompleted(id: string): Promise<void>;
    markAsNoShow(id: string): Promise<void>;

    // Recurrence operations
    createRecurringAppointments(templateData: CreateAppointmentsDto): Promise<any[]>;
    findRecurringSeries(seriesId: string): Promise<any[]>;
    updateRecurringSeries(seriesId: string, data: any, updateAll: boolean): Promise<void>;
    cancelRecurringSeries(seriesId: string, cancelAll: boolean): Promise<void>;

    // Reminder operations
    findAppointmentsForReminders(reminderType: string, minutesBefore: number): Promise<any[]>;
    markReminderSent(id: string, reminderType: string): Promise<void>;
    updateReminderPreferences(participantId: string, preferences: any): Promise<void>;
    sendReminder(id: string, reminderType: string): Promise<void>;

    // Payment operations
    updatePaymentStatus(id: string, status: string, transactionId?: string): Promise<void>;
    findUnpaidAppointments(clientId?: string): Promise<any[]>;
    findOverduePayments(days?: number): Promise<any[]>;
    processPayment(id: string, amount: number, method: string): Promise<any>;
    processRefund(id: string, amount: number, reason: string): Promise<any>;

    // Waiting list operations
    addToWaitingList(appointmentData: any): Promise<void>;
    removeFromWaitingList(id: string): Promise<void>;
    findWaitingListForDate(date: string, providerId?: string): Promise<any[]>;
    notifyWaitingList(availableSlot: any): Promise<void>;

    // Location and resource management
    findByLocation(locationId: string): Promise<any[]>;
    findByRoom(room: string): Promise<any[]>;
    checkResourceAvailability(resourceId: string, startTime: string, endTime: string): Promise<boolean>;
    reserveResources(id: string, resources: string[]): Promise<void>;
    releaseResources(id: string): Promise<void>;

    // Analytics and reporting
    getAppointmentStats(startDate?: string, endDate?: string): Promise<{
        total: number;
        confirmed: number;
        completed: number;
        cancelled: number;
        noShows: number;
        revenue: number;
        averageDuration: number;
    }>;
    getProviderStats(providerId: string, startDate?: string, endDate?: string): Promise<any>;
    getClientStats(clientId: string, startDate?: string, endDate?: string): Promise<any>;
    getPopularServices(limit?: number): Promise<any[]>;
    getBusyPeriods(providerId?: string): Promise<any[]>;

    // Advanced search and filtering
    searchAppointments(query: {
        text?: string;
        status?: string;
        type?: string;
        serviceCategory?: string;
        providerId?: string;
        clientId?: string;
        locationId?: string;
        startDate?: string;
        endDate?: string;
        paymentStatus?: string;
        priority?: number;
        sortBy?: 'date' | 'status' | 'client' | 'provider' | 'service';
        sortOrder?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }): Promise<{
        appointments: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;

    // Bulk operations
    bulkUpdateStatus(appointmentIds: string[], status: string): Promise<void>;
    bulkCancel(appointmentIds: string[], reason?: string): Promise<void>;
    bulkReschedule(updates: Array<{ id: string; startTime: string; endTime: string }>): Promise<void>;
    bulkSendReminders(appointmentIds: string[], reminderType: string): Promise<void>;

    // Integration operations
    syncWithCalendar(appointmentId: string, calendarType: 'google' | 'outlook' | 'apple'): Promise<void>;
    exportToCalendar(appointments: any[], format: 'ics' | 'csv'): Promise<string>;
    importFromCalendar(calendarData: any): Promise<{ success: number; failed: number; errors: any[] }>;

    // Validation and business rules
    validateBookingRules(data: CreateAppointmentsDto): Promise<{ valid: boolean; errors: string[] }>;
    checkCancellationPolicy(id: string): Promise<{ canCancel: boolean; fee?: number; reason?: string }>;
    checkReschedulePolicy(id: string): Promise<{ canReschedule: boolean; fee?: number; reason?: string }>;

    // Emergency and urgent appointments
    findEmergencySlots(providerId?: string): Promise<any[]>;
    createEmergencyAppointment(data: CreateAppointmentsDto): Promise<any>;
    escalateUrgentAppointment(id: string): Promise<void>;

    // Follow-up management
    findAppointmentsNeedingFollowUp(): Promise<any[]>;
    scheduleFollowUp(originalId: string, followUpData: CreateAppointmentsDto): Promise<any>;
    linkAppointments(appointmentIds: string[]): Promise<void>;

    // Compliance and audit
    getAuditLog(appointmentId: string): Promise<any[]>;
    generateComplianceReport(startDate: string, endDate: string): Promise<any>;
    archiveOldAppointments(olderThanDays: number): Promise<number>;

    // Communication
    sendAppointmentNotification(id: string, type: 'confirmation' | 'reminder' | 'cancellation' | 'reschedule'): Promise<void>;
    sendCustomMessage(id: string, message: string, recipients: string[]): Promise<void>;
    getMessageHistory(appointmentId: string): Promise<any[]>;
} 