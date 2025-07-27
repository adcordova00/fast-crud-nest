import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsDto } from './dto/create-appointments.dto';
import { UpdateAppointmentsDto } from './dto/update-appointments.dto';

// DTOs for specific appointment endpoints
class ConfirmAppointmentDto {
    confirmationMethod?: 'email' | 'sms' | 'phone' | 'in_person';
    confirmedBy?: string;
    notes?: string;
}

class CancelAppointmentDto {
    reason!: string;
    cancelledBy?: string;
    refundRequested?: boolean;
    notifyParticipants?: boolean;
}

class RescheduleAppointmentDto {
    newStartTime!: string;
    newEndTime!: string;
    reason?: string;
    rescheduledBy?: string;
    notifyParticipants?: boolean;
}

class CheckInDto {
    checkedInBy?: string;
    actualArrivalTime?: string;
    notes?: string;
}

class ProcessPaymentDto {
    amount!: number;
    method!: string;
    transactionReference?: string;
    notes?: string;
}

class BulkActionDto {
    appointmentIds!: string[];
    action!: 'confirm' | 'cancel' | 'reschedule' | 'send_reminder';
    reason?: string;
    data?: any;
}

class AvailabilityQueryDto {
    providerId!: string;
    date!: string;
    duration!: number;
    serviceType?: string;
}

class SearchAppointmentsDto {
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

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly service: AppointmentsService) { }

    /**
     * Standard CRUD Operations
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateAppointmentsDto) {
        return await this.service.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: string,
        @Query('provider') providerId?: string,
        @Query('client') clientId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('type') type?: string
    ) {
        const params = {
            page: +page,
            limit: +limit,
            status,
            providerId,
            clientId,
            startDate,
            endDate,
            type
        };
        return await this.service.findAll(params);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateAppointmentsDto
    ) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softDelete(@Param('id') id: string) {
        await this.service.softDelete(id);
    }

    /**
     * Advanced Search Endpoints
     */
    @Get('search/advanced')
    async searchAppointments(@Query() query: SearchAppointmentsDto) {
        return await this.service.searchAppointments(query);
    }

    @Get('confirmation/:code')
    async findByConfirmationCode(@Param('code') code: string) {
        return await this.service.findByConfirmationCode(code);
    }

    @Get('provider/:providerId')
    async findByProvider(@Param('providerId') providerId: string) {
        return await this.service.findByProvider(providerId);
    }

    @Get('client/:clientId')
    async findByClient(@Param('clientId') clientId: string) {
        return await this.service.findByClient(clientId);
    }

    /**
     * Schedule Management Endpoints
     */
    @Get('availability/check')
    async checkAvailability(
        @Query('providerId') providerId: string,
        @Query('startTime') startTime: string,
        @Query('endTime') endTime: string
    ) {
        const isAvailable = await this.service.checkAvailability(providerId, startTime, endTime);
        return { available: isAvailable };
    }

    @Get('availability/slots')
    async findAvailableSlots(@Query() query: AvailabilityQueryDto) {
        return await this.service.findAvailableSlots(
            query.providerId,
            query.date,
            query.duration
        );
    }

    @Get('schedule/:providerId')
    async getProviderSchedule(
        @Param('providerId') providerId: string,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        return await this.service.getSchedule(providerId, startDate, endDate);
    }

    /**
     * Status Management Endpoints
     */
    @Put(':id/confirm')
    @HttpCode(HttpStatus.NO_CONTENT)
    async confirmAppointment(
        @Param('id') id: string,
        @Body() confirmData: ConfirmAppointmentDto
    ) {
        await this.service.confirmAppointment(id);
    }

    @Put(':id/cancel')
    @HttpCode(HttpStatus.NO_CONTENT)
    async cancelAppointment(
        @Param('id') id: string,
        @Body() cancelData: CancelAppointmentDto
    ) {
        await this.service.cancelAppointment(id, cancelData.reason);
    }

    @Put(':id/reschedule')
    @HttpCode(HttpStatus.NO_CONTENT)
    async rescheduleAppointment(
        @Param('id') id: string,
        @Body() rescheduleData: RescheduleAppointmentDto
    ) {
        await this.service.rescheduleAppointment(
            id,
            rescheduleData.newStartTime,
            rescheduleData.newEndTime
        );
    }

    @Put(':id/checkin')
    @HttpCode(HttpStatus.NO_CONTENT)
    async checkIn(
        @Param('id') id: string,
        @Body() checkInData: CheckInDto
    ) {
        await this.service.checkIn(id);
    }

    /**
     * Recurring Appointments Endpoints
     */
    @Post('recurring')
    @HttpCode(HttpStatus.CREATED)
    async createRecurringAppointments(@Body() templateData: CreateAppointmentsDto) {
        return await this.service.createRecurringAppointments(templateData);
    }

    /**
     * Payment Management Endpoints
     */
    @Put(':id/payment/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePaymentStatus(
        @Param('id') id: string,
        @Body() paymentData: { status: string; transactionId?: string }
    ) {
        await this.service.updatePaymentStatus(id, paymentData.status, paymentData.transactionId);
    }

    @Post(':id/payment/process')
    async processPayment(
        @Param('id') id: string,
        @Body() paymentData: ProcessPaymentDto
    ) {
        return await this.service.processPayment(id, paymentData.amount, paymentData.method);
    }

    /**
     * Analytics and Reporting Endpoints
     */
    @Get('analytics/stats')
    async getAppointmentStats(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return await this.service.getAppointmentStats(startDate, endDate);
    }

    @Get('analytics/provider/:providerId/stats')
    async getProviderStats(
        @Param('providerId') providerId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return await this.service.getProviderStats(providerId, startDate, endDate);
    }

    /**
     * Bulk Operations Endpoints
     */
    @Put('bulk/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkUpdateStatus(@Body() bulkData: { appointmentIds: string[]; status: string }) {
        await this.service.bulkUpdateStatus(bulkData.appointmentIds, bulkData.status);
    }

    @Put('bulk/cancel')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkCancel(@Body() bulkData: { appointmentIds: string[]; reason?: string }) {
        await this.service.bulkCancel(bulkData.appointmentIds, bulkData.reason);
    }

    /**
     * Emergency Appointments Endpoints
     */
    @Post('emergency')
    @HttpCode(HttpStatus.CREATED)
    async createEmergencyAppointment(@Body() data: CreateAppointmentsDto) {
        return await this.service.createEmergencyAppointment(data);
    }

    /**
     * Communication Endpoints
     */
    @Post(':id/notifications/:type')
    @HttpCode(HttpStatus.NO_CONTENT)
    async sendAppointmentNotification(
        @Param('id') id: string,
        @Param('type') type: 'confirmation' | 'reminder' | 'cancellation' | 'reschedule'
    ) {
        await this.service.sendAppointmentNotification(id, type);
    }

    /**
     * Calendar Integration Endpoints
     */
    @Get('calendar/export')
    async exportToCalendar(
        @Query('format') format: 'ics' | 'csv' = 'ics',
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('providerId') providerId?: string
    ) {
        // Implementation would depend on calendar integration
        return { 
            message: 'Calendar export endpoint - implement based on calendar service',
            format,
            startDate,
            endDate,
            providerId
        };
    }

    @Post('calendar/import')
    async importFromCalendar(@Body() calendarData: any) {
        // Implementation would depend on calendar integration
        return { 
            message: 'Calendar import endpoint - implement based on calendar service',
            dataReceived: !!calendarData
        };
    }

    /**
     * Time-based Appointment Queries
     */
    @Get('schedule/today')
    async getTodaysAppointments(@Query('providerId') providerId?: string) {
        const today = new Date().toISOString().split('T')[0];
        const params = { 
            startDate: today, 
            endDate: today,
            providerId 
        };
        return await this.service.findAll(params);
    }

    @Get('schedule/week')
    async getWeeklyAppointments(@Query('providerId') providerId?: string) {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
        
        const params = { 
            startDate: startOfWeek.toISOString().split('T')[0], 
            endDate: endOfWeek.toISOString().split('T')[0],
            providerId 
        };
        return await this.service.findAll(params);
    }

    @Get('schedule/upcoming')
    async getUpcomingAppointments(
        @Query('days') days = 7,
        @Query('participantId') participantId?: string
    ) {
        // Implementation would use repository method
        return { 
            message: 'Upcoming appointments endpoint - implement repository method',
            days: +days,
            participantId
        };
    }

    /**
     * Waiting List Management
     */
    @Post('waiting-list')
    async addToWaitingList(@Body() appointmentData: any) {
        // Implementation would depend on waiting list logic
        return { 
            message: 'Add to waiting list endpoint - implement waiting list logic',
            dataReceived: !!appointmentData
        };
    }

    @Get('waiting-list/:date')
    async getWaitingList(
        @Param('date') date: string,
        @Query('providerId') providerId?: string
    ) {
        return { 
            message: 'Get waiting list endpoint - implement waiting list logic',
            date,
            providerId
        };
    }

    /**
     * Resource Management
     */
    @Get('resources/availability')
    async checkResourceAvailability(
        @Query('resourceId') resourceId: string,
        @Query('startTime') startTime: string,
        @Query('endTime') endTime: string
    ) {
        return { 
            message: 'Resource availability endpoint - implement resource management',
            resourceId,
            startTime,
            endTime
        };
    }

    /**
     * Follow-up Management
     */
    @Get('follow-ups/needed')
    async getAppointmentsNeedingFollowUp() {
        return { 
            message: 'Follow-ups needed endpoint - implement follow-up logic'
        };
    }

    @Post(':id/follow-up')
    async scheduleFollowUp(
        @Param('id') originalId: string,
        @Body() followUpData: CreateAppointmentsDto
    ) {
        return { 
            message: 'Schedule follow-up endpoint - implement follow-up scheduling',
            originalId,
            hasData: !!followUpData
        };
    }

    /**
     * Compliance and Audit
     */
    @Get(':id/audit-log')
    async getAuditLog(@Param('id') appointmentId: string) {
        return { 
            message: 'Audit log endpoint - implement audit tracking',
            appointmentId
        };
    }

    @Get('compliance/report')
    async generateComplianceReport(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        return { 
            message: 'Compliance report endpoint - implement compliance reporting',
            startDate,
            endDate
        };
    }

    /**
     * Advanced Features
     */
    @Post(':id/duplicate')
    async duplicateAppointment(@Param('id') id: string) {
        const originalAppointment = await this.service.findById(id);
        
        // Create a copy with modified timing
        const duplicateData = {
            ...originalAppointment,
            schedule: {
                ...originalAppointment.schedule,
                status: 'scheduled',
                confirmationCode: undefined,
                bookedAt: new Date().toISOString()
            }
        };

        // Remove ID and audit fields
        delete duplicateData.id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;

        return await this.service.create(duplicateData);
    }

    @Get('dashboard/summary')
    async getDashboardSummary(@Query('providerId') providerId?: string) {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const params = { providerId };
        
        const [
            todaysAppointments,
            tomorrowsAppointments,
            stats
        ] = await Promise.all([
            this.service.findAll({ ...params, startDate: today, endDate: today }),
            this.service.findAll({ ...params, startDate: tomorrow, endDate: tomorrow }),
            this.service.getAppointmentStats()
        ]);

        return {
            today: {
                total: todaysAppointments.length,
                confirmed: todaysAppointments.filter(a => a.schedule?.status === 'confirmed').length,
                pending: todaysAppointments.filter(a => a.schedule?.status === 'scheduled').length
            },
            tomorrow: {
                total: tomorrowsAppointments.length,
                scheduled: tomorrowsAppointments.length
            },
            overall: stats
        };
    }

    /**
     * Health Check Endpoints
     */
    @Get('health/overdue')
    async findOverdueAppointments() {
        return { 
            message: 'Overdue appointments health check - implement overdue detection'
        };
    }

    @Get('health/conflicts')
    async findScheduleConflicts(@Query('providerId') providerId?: string) {
        return { 
            message: 'Schedule conflicts health check - implement conflict detection',
            providerId
        };
    }

    @Get('health/no-shows')
    async getNoShowStatistics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return { 
            message: 'No-show statistics - implement no-show tracking',
            startDate,
            endDate
        };
    }
} 