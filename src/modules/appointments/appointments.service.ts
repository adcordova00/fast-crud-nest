import { Injectable, Inject } from '@nestjs/common';
import { AppointmentsRepositoryPort, APPOINTMENTS_REPOSITORY_PORT } from '../../core/ports/appointments-repository.port';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';
import { FastCrudValidationException } from '../../core/exceptions/validation.exception';
import { FastCrudException } from '../../core/exceptions/fast-crud.exception';

@Injectable()
export class AppointmentsService {
    constructor(
        @Inject(APPOINTMENTS_REPOSITORY_PORT)
        private readonly repository: AppointmentsRepositoryPort,
    ) { }

    /**
     * Creates a new appointment with comprehensive validation
     */
    async create(dto: CreateAppointmentsDto): Promise<any> {
        try {
            console.log('[FAST-CRUD] AppointmentsService.create called');
            
            // Validate appointment timing
            if (dto.schedule?.startDateTime && dto.schedule?.endDateTime) {
                const startTime = new Date(dto.schedule.startDateTime);
                const endTime = new Date(dto.schedule.endDateTime);
                
                if (startTime >= endTime) {
                    throw new FastCrudValidationException('End time must be after start time');
                }

                // Check if appointment is in the past
                if (startTime < new Date()) {
                    throw new FastCrudValidationException('Cannot schedule appointments in the past');
                }
            }

            // Validate confirmation code uniqueness
            if (dto.schedule?.confirmationCode) {
                const existingConfirmation = await this.repository.findByConfirmationCode(dto.schedule.confirmationCode);
                if (existingConfirmation) {
                    throw new FastCrudValidationException('Confirmation code already exists', { code: dto.schedule.confirmationCode });
                }
            }

            // Validate provider availability
            if (dto.participants?.primaryProviderId && dto.schedule?.startDateTime && dto.schedule?.endDateTime) {
                const isAvailable = await this.repository.checkAvailability(
                    dto.participants.primaryProviderId,
                    dto.schedule.startDateTime,
                    dto.schedule.endDateTime
                );
                
                if (!isAvailable) {
                    throw new FastCrudValidationException('Provider is not available at the requested time');
                }
            }

            // Validate business rules
            const rulesValidation = await this.repository.validateBookingRules(dto);
            if (!rulesValidation.valid) {
                throw new FastCrudValidationException('Booking validation failed', { errors: rulesValidation.errors });
            }

            // Validate participant requirements
            if (dto.participants?.maxParticipants && dto.participants?.participants) {
                if (dto.participants.participants.length > dto.participants.maxParticipants) {
                    throw new FastCrudValidationException('Number of participants exceeds maximum allowed');
                }
            }

            // Validate payment information
            if (dto.payment?.totalAmount && dto.payment?.paidAmount) {
                if (dto.payment.paidAmount > dto.payment.totalAmount) {
                    throw new FastCrudValidationException('Paid amount cannot exceed total amount');
                }
            }

            return await this.repository.create(dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CREATE_FAILED', 'Failed to create appointment', 500, error);
        }
    }

    /**
     * Standard CRUD operations
     */
    async findAll(params: any = {}): Promise<any[]> {
        try {
            return await this.repository.findAll(params);
        } catch (error) {
            throw new FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve appointments', 500, error);
        }
    }

    async findById(id: string): Promise<any> {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve appointment', 500, error);
        }
    }

    async update(id: string, dto: UpdateAppointmentsDto): Promise<any> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            // Validate timing updates
            if (dto.schedule?.startDateTime && dto.schedule?.endDateTime) {
                const startTime = new Date(dto.schedule.startDateTime);
                const endTime = new Date(dto.schedule.endDateTime);
                
                if (startTime >= endTime) {
                    throw new FastCrudValidationException('End time must be after start time');
                }
            }

            // Check reschedule policy if time is being changed
            if (dto.schedule?.startDateTime || dto.schedule?.endDateTime) {
                const reschedulePolicy = await this.repository.checkReschedulePolicy(id);
                if (!reschedulePolicy.canReschedule) {
                    throw new FastCrudValidationException('Appointment cannot be rescheduled', { reason: reschedulePolicy.reason });
                }
            }

            return await this.repository.update(id, dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_FAILED', 'Failed to update appointment', 500, error);
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            // Check cancellation policy
            const cancellationPolicy = await this.repository.checkCancellationPolicy(id);
            if (!cancellationPolicy.canCancel) {
                throw new FastCrudValidationException('Appointment cannot be cancelled', { reason: cancellationPolicy.reason });
            }

            await this.repository.softDelete(id);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('DELETE_FAILED', 'Failed to delete appointment', 500, error);
        }
    }

    /**
     * Appointment-specific search methods
     */
    async findByConfirmationCode(code: string): Promise<any> {
        try {
            const result = await this.repository.findByConfirmationCode(code);
            if (!result) {
                throw new FastCrudValidationException(`Appointment with confirmation code ${code} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_BY_CODE_FAILED', 'Failed to find appointment by confirmation code', 500, error);
        }
    }

    async findByProvider(providerId: string): Promise<any[]> {
        try {
            return await this.repository.findByProvider(providerId);
        } catch (error) {
            throw new FastCrudException('FIND_BY_PROVIDER_FAILED', 'Failed to find appointments by provider', 500, error);
        }
    }

    async findByClient(clientId: string): Promise<any[]> {
        try {
            return await this.repository.findByClient(clientId);
        } catch (error) {
            throw new FastCrudException('FIND_BY_CLIENT_FAILED', 'Failed to find appointments by client', 500, error);
        }
    }

    /**
     * Schedule management
     */
    async checkAvailability(providerId: string, startTime: string, endTime: string): Promise<boolean> {
        try {
            return await this.repository.checkAvailability(providerId, startTime, endTime);
        } catch (error) {
            throw new FastCrudException('CHECK_AVAILABILITY_FAILED', 'Failed to check availability', 500, error);
        }
    }

    async findAvailableSlots(providerId: string, date: string, duration: number): Promise<any> {
        try {
            if (duration <= 0) {
                throw new FastCrudValidationException('Duration must be greater than 0');
            }

            return await this.repository.findAvailableSlots(providerId, date, duration);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_SLOTS_FAILED', 'Failed to find available slots', 500, error);
        }
    }

    async getSchedule(providerId: string, startDate: string, endDate: string): Promise<any[]> {
        try {
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            if (start >= end) {
                throw new FastCrudValidationException('End date must be after start date');
            }

            return await this.repository.getSchedule(providerId, startDate, endDate);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('GET_SCHEDULE_FAILED', 'Failed to get schedule', 500, error);
        }
    }

    /**
     * Status management operations
     */
    async confirmAppointment(id: string): Promise<void> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            if (appointment.schedule?.status === 'confirmed') {
                throw new FastCrudValidationException('Appointment is already confirmed');
            }

            await this.repository.confirmAppointment(id);
            console.log(`[FAST-CRUD] Appointment ${id} confirmed`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CONFIRM_FAILED', 'Failed to confirm appointment', 500, error);
        }
    }

    async cancelAppointment(id: string, reason?: string): Promise<void> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            // Check cancellation policy
            const cancellationPolicy = await this.repository.checkCancellationPolicy(id);
            if (!cancellationPolicy.canCancel) {
                throw new FastCrudValidationException('Appointment cannot be cancelled', { reason: cancellationPolicy.reason });
            }

            await this.repository.cancelAppointment(id, reason);
            console.log(`[FAST-CRUD] Appointment ${id} cancelled. Reason: ${reason || 'Not specified'}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CANCEL_FAILED', 'Failed to cancel appointment', 500, error);
        }
    }

    async rescheduleAppointment(id: string, newStartTime: string, newEndTime: string): Promise<void> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            // Validate new timing
            const startTime = new Date(newStartTime);
            const endTime = new Date(newEndTime);
            
            if (startTime >= endTime) {
                throw new FastCrudValidationException('End time must be after start time');
            }

            if (startTime < new Date()) {
                throw new FastCrudValidationException('Cannot reschedule to past time');
            }

            // Check reschedule policy
            const reschedulePolicy = await this.repository.checkReschedulePolicy(id);
            if (!reschedulePolicy.canReschedule) {
                throw new FastCrudValidationException('Appointment cannot be rescheduled', { reason: reschedulePolicy.reason });
            }

            // Check provider availability for new time
            if (appointment.participants?.primaryProviderId) {
                const isAvailable = await this.repository.checkAvailability(
                    appointment.participants.primaryProviderId,
                    newStartTime,
                    newEndTime
                );
                
                if (!isAvailable) {
                    throw new FastCrudValidationException('Provider is not available at the new requested time');
                }
            }

            await this.repository.rescheduleAppointment(id, newStartTime, newEndTime);
            console.log(`[FAST-CRUD] Appointment ${id} rescheduled to ${newStartTime} - ${newEndTime}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('RESCHEDULE_FAILED', 'Failed to reschedule appointment', 500, error);
        }
    }

    async checkIn(id: string): Promise<void> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            if (appointment.schedule?.status !== 'confirmed') {
                throw new FastCrudValidationException('Only confirmed appointments can be checked in');
            }

            await this.repository.checkIn(id);
            console.log(`[FAST-CRUD] Appointment ${id} checked in`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CHECKIN_FAILED', 'Failed to check in appointment', 500, error);
        }
    }

    /**
     * Recurrence operations
     */
    async createRecurringAppointments(templateData: CreateAppointmentsDto): Promise<any[]> {
        try {
            if (!templateData.recurrence?.pattern || templateData.recurrence.pattern === 'none') {
                throw new FastCrudValidationException('Recurrence pattern is required for recurring appointments');
            }

            return await this.repository.createRecurringAppointments(templateData);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CREATE_RECURRING_FAILED', 'Failed to create recurring appointments', 500, error);
        }
    }

    /**
     * Payment operations
     */
    async updatePaymentStatus(id: string, status: string, transactionId?: string): Promise<void> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            const validStatuses = ['unpaid', 'paid', 'partial', 'refunded', 'pending', 'failed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                throw new FastCrudValidationException('Invalid payment status');
            }

            await this.repository.updatePaymentStatus(id, status, transactionId);
            console.log(`[FAST-CRUD] Payment status updated for appointment ${id}: ${status}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_PAYMENT_FAILED', 'Failed to update payment status', 500, error);
        }
    }

    async processPayment(id: string, amount: number, method: string): Promise<any> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            if (amount <= 0) {
                throw new FastCrudValidationException('Payment amount must be greater than 0');
            }

            return await this.repository.processPayment(id, amount, method);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('PROCESS_PAYMENT_FAILED', 'Failed to process payment', 500, error);
        }
    }

    /**
     * Analytics and reporting
     */
    async getAppointmentStats(startDate?: string, endDate?: string): Promise<any> {
        try {
            return await this.repository.getAppointmentStats(startDate, endDate);
        } catch (error) {
            throw new FastCrudException('GET_STATS_FAILED', 'Failed to get appointment statistics', 500, error);
        }
    }

    async getProviderStats(providerId: string, startDate?: string, endDate?: string): Promise<any> {
        try {
            return await this.repository.getProviderStats(providerId, startDate, endDate);
        } catch (error) {
            throw new FastCrudException('GET_PROVIDER_STATS_FAILED', 'Failed to get provider statistics', 500, error);
        }
    }

    /**
     * Advanced search functionality
     */
    async searchAppointments(query: any): Promise<any> {
        try {
            // Validate search parameters
            if (query.startDate && query.endDate) {
                const startDate = new Date(query.startDate);
                const endDate = new Date(query.endDate);
                
                if (startDate >= endDate) {
                    throw new FastCrudValidationException('End date must be after start date');
                }
            }

            if (query.page && query.page < 1) {
                throw new FastCrudValidationException('Page number must be greater than 0');
            }

            if (query.limit && (query.limit < 1 || query.limit > 100)) {
                throw new FastCrudValidationException('Limit must be between 1 and 100');
            }

            return await this.repository.searchAppointments(query);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SEARCH_FAILED', 'Failed to search appointments', 500, error);
        }
    }

    /**
     * Bulk operations
     */
    async bulkUpdateStatus(appointmentIds: string[], status: string): Promise<void> {
        try {
            if (!appointmentIds || appointmentIds.length === 0) {
                throw new FastCrudValidationException('Appointment IDs array cannot be empty');
            }

            const validStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'];
            if (!validStatuses.includes(status)) {
                throw new FastCrudValidationException('Invalid status value');
            }

            await this.repository.bulkUpdateStatus(appointmentIds, status);
            console.log(`[FAST-CRUD] Bulk status update: ${appointmentIds.length} appointments to ${status}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('BULK_UPDATE_STATUS_FAILED', 'Failed to bulk update status', 500, error);
        }
    }

    async bulkCancel(appointmentIds: string[], reason?: string): Promise<void> {
        try {
            if (!appointmentIds || appointmentIds.length === 0) {
                throw new FastCrudValidationException('Appointment IDs array cannot be empty');
            }

            await this.repository.bulkCancel(appointmentIds, reason);
            console.log(`[FAST-CRUD] Bulk cancellation: ${appointmentIds.length} appointments cancelled`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('BULK_CANCEL_FAILED', 'Failed to bulk cancel appointments', 500, error);
        }
    }

    /**
     * Emergency and urgent appointments
     */
    async createEmergencyAppointment(data: CreateAppointmentsDto): Promise<any> {
        try {
            // Emergency appointments have special rules
            const emergencyData = {
                ...data,
                schedule: {
                    ...data.schedule,
                    isUrgent: true,
                    priority: 10, // Highest priority
                    type: 'emergency' as any
                }
            };

            return await this.repository.createEmergencyAppointment(emergencyData);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CREATE_EMERGENCY_FAILED', 'Failed to create emergency appointment', 500, error);
        }
    }

    /**
     * Communication
     */
    async sendAppointmentNotification(id: string, type: 'confirmation' | 'reminder' | 'cancellation' | 'reschedule'): Promise<void> {
        try {
            const appointment = await this.repository.findById(id);
            if (!appointment) {
                throw new FastCrudValidationException(`Appointment with ID ${id} not found`);
            }

            await this.repository.sendAppointmentNotification(id, type);
            console.log(`[FAST-CRUD] ${type} notification sent for appointment ${id}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SEND_NOTIFICATION_FAILED', 'Failed to send notification', 500, error);
        }
    }
} 