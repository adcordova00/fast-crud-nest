import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';
declare class ConfirmAppointmentDto {
    confirmationMethod?: 'email' | 'sms' | 'phone' | 'in_person';
    confirmedBy?: string;
    notes?: string;
}
declare class CancelAppointmentDto {
    reason: string;
    cancelledBy?: string;
    refundRequested?: boolean;
    notifyParticipants?: boolean;
}
declare class RescheduleAppointmentDto {
    newStartTime: string;
    newEndTime: string;
    reason?: string;
    rescheduledBy?: string;
    notifyParticipants?: boolean;
}
declare class CheckInDto {
    checkedInBy?: string;
    actualArrivalTime?: string;
    notes?: string;
}
declare class ProcessPaymentDto {
    amount: number;
    method: string;
    transactionReference?: string;
    notes?: string;
}
declare class AvailabilityQueryDto {
    providerId: string;
    date: string;
    duration: number;
    serviceType?: string;
}
declare class SearchAppointmentsDto {
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
}
export declare class AppointmentsController {
    private readonly service;
    constructor(service: AppointmentsService);
    create(dto: CreateAppointmentsDto): Promise<any>;
    findAll(page?: number, limit?: number, status?: string, providerId?: string, clientId?: string, startDate?: string, endDate?: string, type?: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateAppointmentsDto): Promise<any>;
    softDelete(id: string): Promise<void>;
    searchAppointments(query: SearchAppointmentsDto): Promise<any>;
    findByConfirmationCode(code: string): Promise<any>;
    findByProvider(providerId: string): Promise<any[]>;
    findByClient(clientId: string): Promise<any[]>;
    checkAvailability(providerId: string, startTime: string, endTime: string): Promise<{
        available: boolean;
    }>;
    findAvailableSlots(query: AvailabilityQueryDto): Promise<any>;
    getProviderSchedule(providerId: string, startDate: string, endDate: string): Promise<any[]>;
    confirmAppointment(id: string, confirmData: ConfirmAppointmentDto): Promise<void>;
    cancelAppointment(id: string, cancelData: CancelAppointmentDto): Promise<void>;
    rescheduleAppointment(id: string, rescheduleData: RescheduleAppointmentDto): Promise<void>;
    checkIn(id: string, checkInData: CheckInDto): Promise<void>;
    createRecurringAppointments(templateData: CreateAppointmentsDto): Promise<any[]>;
    updatePaymentStatus(id: string, paymentData: {
        status: string;
        transactionId?: string;
    }): Promise<void>;
    processPayment(id: string, paymentData: ProcessPaymentDto): Promise<any>;
    getAppointmentStats(startDate?: string, endDate?: string): Promise<any>;
    getProviderStats(providerId: string, startDate?: string, endDate?: string): Promise<any>;
    bulkUpdateStatus(bulkData: {
        appointmentIds: string[];
        status: string;
    }): Promise<void>;
    bulkCancel(bulkData: {
        appointmentIds: string[];
        reason?: string;
    }): Promise<void>;
    createEmergencyAppointment(data: CreateAppointmentsDto): Promise<any>;
    sendAppointmentNotification(id: string, type: 'confirmation' | 'reminder' | 'cancellation' | 'reschedule'): Promise<void>;
    exportToCalendar(format?: 'ics' | 'csv', startDate?: string, endDate?: string, providerId?: string): Promise<{
        message: string;
        format: "ics" | "csv";
        startDate: string;
        endDate: string;
        providerId: string;
    }>;
    importFromCalendar(calendarData: any): Promise<{
        message: string;
        dataReceived: boolean;
    }>;
    getTodaysAppointments(providerId?: string): Promise<any[]>;
    getWeeklyAppointments(providerId?: string): Promise<any[]>;
    getUpcomingAppointments(days?: number, participantId?: string): Promise<{
        message: string;
        days: number;
        participantId: string;
    }>;
    addToWaitingList(appointmentData: any): Promise<{
        message: string;
        dataReceived: boolean;
    }>;
    getWaitingList(date: string, providerId?: string): Promise<{
        message: string;
        date: string;
        providerId: string;
    }>;
    checkResourceAvailability(resourceId: string, startTime: string, endTime: string): Promise<{
        message: string;
        resourceId: string;
        startTime: string;
        endTime: string;
    }>;
    getAppointmentsNeedingFollowUp(): Promise<{
        message: string;
    }>;
    scheduleFollowUp(originalId: string, followUpData: CreateAppointmentsDto): Promise<{
        message: string;
        originalId: string;
        hasData: boolean;
    }>;
    getAuditLog(appointmentId: string): Promise<{
        message: string;
        appointmentId: string;
    }>;
    generateComplianceReport(startDate: string, endDate: string): Promise<{
        message: string;
        startDate: string;
        endDate: string;
    }>;
    duplicateAppointment(id: string): Promise<any>;
    getDashboardSummary(providerId?: string): Promise<{
        today: {
            total: number;
            confirmed: number;
            pending: number;
        };
        tomorrow: {
            total: number;
            scheduled: number;
        };
        overall: any;
    }>;
    findOverdueAppointments(): Promise<{
        message: string;
    }>;
    findScheduleConflicts(providerId?: string): Promise<{
        message: string;
        providerId: string;
    }>;
    getNoShowStatistics(startDate?: string, endDate?: string): Promise<{
        message: string;
        startDate: string;
        endDate: string;
    }>;
}
export {};
