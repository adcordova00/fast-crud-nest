"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const appointments_repository_port_1 = require("../../core/ports/appointments-repository.port");
const validation_exception_1 = require("../../core/exceptions/validation.exception");
const fast_crud_exception_1 = require("../../core/exceptions/fast-crud.exception");
let AppointmentsService = class AppointmentsService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            console.log('[FAST-CRUD] AppointmentsService.create called');
            if (dto.schedule?.startDateTime && dto.schedule?.endDateTime) {
                const startTime = new Date(dto.schedule.startDateTime);
                const endTime = new Date(dto.schedule.endDateTime);
                if (startTime >= endTime) {
                    throw new validation_exception_1.FastCrudValidationException('End time must be after start time');
                }
                if (startTime < new Date()) {
                    throw new validation_exception_1.FastCrudValidationException('Cannot schedule appointments in the past');
                }
            }
            if (dto.schedule?.confirmationCode) {
                const existingConfirmation = await this.repository.findByConfirmationCode(dto.schedule.confirmationCode);
                if (existingConfirmation) {
                    throw new validation_exception_1.FastCrudValidationException('Confirmation code already exists', { code: dto.schedule.confirmationCode });
                }
            }
            if (dto.participants?.primaryProviderId && dto.schedule?.startDateTime && dto.schedule?.endDateTime) {
                const isAvailable = await this.repository.checkAvailability(dto.participants.primaryProviderId, dto.schedule.startDateTime, dto.schedule.endDateTime);
                if (!isAvailable) {
                    throw new validation_exception_1.FastCrudValidationException('Provider is not available at the requested time');
                }
            }
            const rulesValidation = await this.repository.validateBookingRules(dto);
            if (!rulesValidation.valid) {
                throw new validation_exception_1.FastCrudValidationException('Booking validation failed', { errors: rulesValidation.errors });
            }
            if (dto.participants?.maxParticipants && dto.participants?.participants) {
                if (dto.participants.participants.length > dto.participants.maxParticipants) {
                    throw new validation_exception_1.FastCrudValidationException('Number of participants exceeds maximum allowed');
                }
            }
            if (dto.payment?.totalAmount && dto.payment?.paidAmount) {
                if (dto.payment.paidAmount > dto.payment.totalAmount) {
                    throw new validation_exception_1.FastCrudValidationException('Paid amount cannot exceed total amount');
                }
            }
            return await this.repository.create(dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CREATE_FAILED', 'Failed to create appointment', 500, error);
        }
    }
    async findAll(params = {}) {
        try {
            return await this.repository.findAll(params);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve appointments', 500, error);
        }
    }
    async findById(id) {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve appointment', 500, error);
        }
    }
    async update(id, dto) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            if (dto.schedule?.startDateTime && dto.schedule?.endDateTime) {
                const startTime = new Date(dto.schedule.startDateTime);
                const endTime = new Date(dto.schedule.endDateTime);
                if (startTime >= endTime) {
                    throw new validation_exception_1.FastCrudValidationException('End time must be after start time');
                }
            }
            if (dto.schedule?.startDateTime || dto.schedule?.endDateTime) {
                const reschedulePolicy = await this.repository.checkReschedulePolicy(id);
                if (!reschedulePolicy.canReschedule) {
                    throw new validation_exception_1.FastCrudValidationException('Appointment cannot be rescheduled', { reason: reschedulePolicy.reason });
                }
            }
            return await this.repository.update(id, dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_FAILED', 'Failed to update appointment', 500, error);
        }
    }
    async softDelete(id) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            const cancellationPolicy = await this.repository.checkCancellationPolicy(id);
            if (!cancellationPolicy.canCancel) {
                throw new validation_exception_1.FastCrudValidationException('Appointment cannot be cancelled', { reason: cancellationPolicy.reason });
            }
            await this.repository.softDelete(id);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('DELETE_FAILED', 'Failed to delete appointment', 500, error);
        }
    }
    async findByConfirmationCode(code) {
        try {
            const result = await this.repository.findByConfirmationCode(code);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with confirmation code ${code} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_BY_CODE_FAILED', 'Failed to find appointment by confirmation code', 500, error);
        }
    }
    async findByProvider(providerId) {
        try {
            return await this.repository.findByProvider(providerId);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_BY_PROVIDER_FAILED', 'Failed to find appointments by provider', 500, error);
        }
    }
    async findByClient(clientId) {
        try {
            return await this.repository.findByClient(clientId);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_BY_CLIENT_FAILED', 'Failed to find appointments by client', 500, error);
        }
    }
    async checkAvailability(providerId, startTime, endTime) {
        try {
            return await this.repository.checkAvailability(providerId, startTime, endTime);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('CHECK_AVAILABILITY_FAILED', 'Failed to check availability', 500, error);
        }
    }
    async findAvailableSlots(providerId, date, duration) {
        try {
            if (duration <= 0) {
                throw new validation_exception_1.FastCrudValidationException('Duration must be greater than 0');
            }
            return await this.repository.findAvailableSlots(providerId, date, duration);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_SLOTS_FAILED', 'Failed to find available slots', 500, error);
        }
    }
    async getSchedule(providerId, startDate, endDate) {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (start >= end) {
                throw new validation_exception_1.FastCrudValidationException('End date must be after start date');
            }
            return await this.repository.getSchedule(providerId, startDate, endDate);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('GET_SCHEDULE_FAILED', 'Failed to get schedule', 500, error);
        }
    }
    async confirmAppointment(id) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            if (appointment.schedule?.status === 'confirmed') {
                throw new validation_exception_1.FastCrudValidationException('Appointment is already confirmed');
            }
            await this.repository.confirmAppointment(id);
            console.log(`[FAST-CRUD] Appointment ${id} confirmed`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CONFIRM_FAILED', 'Failed to confirm appointment', 500, error);
        }
    }
    async cancelAppointment(id, reason) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            const cancellationPolicy = await this.repository.checkCancellationPolicy(id);
            if (!cancellationPolicy.canCancel) {
                throw new validation_exception_1.FastCrudValidationException('Appointment cannot be cancelled', { reason: cancellationPolicy.reason });
            }
            await this.repository.cancelAppointment(id, reason);
            console.log(`[FAST-CRUD] Appointment ${id} cancelled. Reason: ${reason || 'Not specified'}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CANCEL_FAILED', 'Failed to cancel appointment', 500, error);
        }
    }
    async rescheduleAppointment(id, newStartTime, newEndTime) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            const startTime = new Date(newStartTime);
            const endTime = new Date(newEndTime);
            if (startTime >= endTime) {
                throw new validation_exception_1.FastCrudValidationException('End time must be after start time');
            }
            if (startTime < new Date()) {
                throw new validation_exception_1.FastCrudValidationException('Cannot reschedule to past time');
            }
            const reschedulePolicy = await this.repository.checkReschedulePolicy(id);
            if (!reschedulePolicy.canReschedule) {
                throw new validation_exception_1.FastCrudValidationException('Appointment cannot be rescheduled', { reason: reschedulePolicy.reason });
            }
            if (appointment.participants?.primaryProviderId) {
                const isAvailable = await this.repository.checkAvailability(appointment.participants.primaryProviderId, newStartTime, newEndTime);
                if (!isAvailable) {
                    throw new validation_exception_1.FastCrudValidationException('Provider is not available at the new requested time');
                }
            }
            await this.repository.rescheduleAppointment(id, newStartTime, newEndTime);
            console.log(`[FAST-CRUD] Appointment ${id} rescheduled to ${newStartTime} - ${newEndTime}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('RESCHEDULE_FAILED', 'Failed to reschedule appointment', 500, error);
        }
    }
    async checkIn(id) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            if (appointment.schedule?.status !== 'confirmed') {
                throw new validation_exception_1.FastCrudValidationException('Only confirmed appointments can be checked in');
            }
            await this.repository.checkIn(id);
            console.log(`[FAST-CRUD] Appointment ${id} checked in`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CHECKIN_FAILED', 'Failed to check in appointment', 500, error);
        }
    }
    async createRecurringAppointments(templateData) {
        try {
            if (!templateData.recurrence?.pattern || templateData.recurrence.pattern === 'none') {
                throw new validation_exception_1.FastCrudValidationException('Recurrence pattern is required for recurring appointments');
            }
            return await this.repository.createRecurringAppointments(templateData);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CREATE_RECURRING_FAILED', 'Failed to create recurring appointments', 500, error);
        }
    }
    async updatePaymentStatus(id, status, transactionId) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            const validStatuses = ['unpaid', 'paid', 'partial', 'refunded', 'pending', 'failed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid payment status');
            }
            await this.repository.updatePaymentStatus(id, status, transactionId);
            console.log(`[FAST-CRUD] Payment status updated for appointment ${id}: ${status}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_PAYMENT_FAILED', 'Failed to update payment status', 500, error);
        }
    }
    async processPayment(id, amount, method) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            if (amount <= 0) {
                throw new validation_exception_1.FastCrudValidationException('Payment amount must be greater than 0');
            }
            return await this.repository.processPayment(id, amount, method);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('PROCESS_PAYMENT_FAILED', 'Failed to process payment', 500, error);
        }
    }
    async getAppointmentStats(startDate, endDate) {
        try {
            return await this.repository.getAppointmentStats(startDate, endDate);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_STATS_FAILED', 'Failed to get appointment statistics', 500, error);
        }
    }
    async getProviderStats(providerId, startDate, endDate) {
        try {
            return await this.repository.getProviderStats(providerId, startDate, endDate);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_PROVIDER_STATS_FAILED', 'Failed to get provider statistics', 500, error);
        }
    }
    async searchAppointments(query) {
        try {
            if (query.startDate && query.endDate) {
                const startDate = new Date(query.startDate);
                const endDate = new Date(query.endDate);
                if (startDate >= endDate) {
                    throw new validation_exception_1.FastCrudValidationException('End date must be after start date');
                }
            }
            if (query.page && query.page < 1) {
                throw new validation_exception_1.FastCrudValidationException('Page number must be greater than 0');
            }
            if (query.limit && (query.limit < 1 || query.limit > 100)) {
                throw new validation_exception_1.FastCrudValidationException('Limit must be between 1 and 100');
            }
            return await this.repository.searchAppointments(query);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SEARCH_FAILED', 'Failed to search appointments', 500, error);
        }
    }
    async bulkUpdateStatus(appointmentIds, status) {
        try {
            if (!appointmentIds || appointmentIds.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Appointment IDs array cannot be empty');
            }
            const validStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'];
            if (!validStatuses.includes(status)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid status value');
            }
            await this.repository.bulkUpdateStatus(appointmentIds, status);
            console.log(`[FAST-CRUD] Bulk status update: ${appointmentIds.length} appointments to ${status}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('BULK_UPDATE_STATUS_FAILED', 'Failed to bulk update status', 500, error);
        }
    }
    async bulkCancel(appointmentIds, reason) {
        try {
            if (!appointmentIds || appointmentIds.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Appointment IDs array cannot be empty');
            }
            await this.repository.bulkCancel(appointmentIds, reason);
            console.log(`[FAST-CRUD] Bulk cancellation: ${appointmentIds.length} appointments cancelled`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('BULK_CANCEL_FAILED', 'Failed to bulk cancel appointments', 500, error);
        }
    }
    async createEmergencyAppointment(data) {
        try {
            const emergencyData = {
                ...data,
                schedule: {
                    ...data.schedule,
                    isUrgent: true,
                    priority: 10,
                    type: 'emergency'
                }
            };
            return await this.repository.createEmergencyAppointment(emergencyData);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CREATE_EMERGENCY_FAILED', 'Failed to create emergency appointment', 500, error);
        }
    }
    async sendAppointmentNotification(id, type) {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new validation_exception_1.FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            await this.repository.sendAppointmentNotification(id, type);
            console.log(`[FAST-CRUD] ${type} notification sent for appointment ${id}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SEND_NOTIFICATION_FAILED', 'Failed to send notification', 500, error);
        }
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(appointments_repository_port_1.APPOINTMENTS_REPOSITORY_PORT)),
    __metadata("design:paramtypes", [Object])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map