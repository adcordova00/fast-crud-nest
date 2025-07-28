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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const appointments_service_1 = require("./appointments.service");
const create_appointments_dto_1 = require("./dto/create-appointments.dto");
const update_appointments_dto_1 = require("./dto/update-appointments.dto");
class ConfirmAppointmentDto {
}
class CancelAppointmentDto {
}
class RescheduleAppointmentDto {
}
class CheckInDto {
}
class ProcessPaymentDto {
}
class BulkActionDto {
}
class AvailabilityQueryDto {
}
class SearchAppointmentsDto {
}
let AppointmentsController = class AppointmentsController {
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return await this.service.create(dto);
    }
    async findAll(page = 1, limit = 10, status, providerId, clientId, startDate, endDate, type) {
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
    async findById(id) {
        return await this.service.findById(id);
    }
    async update(id, dto) {
        return await this.service.update(id, dto);
    }
    async softDelete(id) {
        await this.service.softDelete(id);
    }
    async searchAppointments(query) {
        return await this.service.searchAppointments(query);
    }
    async findByConfirmationCode(code) {
        return await this.service.findByConfirmationCode(code);
    }
    async findByProvider(providerId) {
        return await this.service.findByProvider(providerId);
    }
    async findByClient(clientId) {
        return await this.service.findByClient(clientId);
    }
    async checkAvailability(providerId, startTime, endTime) {
        const isAvailable = await this.service.checkAvailability(providerId, startTime, endTime);
        return { available: isAvailable };
    }
    async findAvailableSlots(query) {
        return await this.service.findAvailableSlots(query.providerId, query.date, query.duration);
    }
    async getProviderSchedule(providerId, startDate, endDate) {
        return await this.service.getSchedule(providerId, startDate, endDate);
    }
    async confirmAppointment(id, confirmData) {
        await this.service.confirmAppointment(id);
    }
    async cancelAppointment(id, cancelData) {
        await this.service.cancelAppointment(id, cancelData.reason);
    }
    async rescheduleAppointment(id, rescheduleData) {
        await this.service.rescheduleAppointment(id, rescheduleData.newStartTime, rescheduleData.newEndTime);
    }
    async checkIn(id, checkInData) {
        await this.service.checkIn(id);
    }
    async createRecurringAppointments(templateData) {
        return await this.service.createRecurringAppointments(templateData);
    }
    async updatePaymentStatus(id, paymentData) {
        await this.service.updatePaymentStatus(id, paymentData.status, paymentData.transactionId);
    }
    async processPayment(id, paymentData) {
        return await this.service.processPayment(id, paymentData.amount, paymentData.method);
    }
    async getAppointmentStats(startDate, endDate) {
        return await this.service.getAppointmentStats(startDate, endDate);
    }
    async getProviderStats(providerId, startDate, endDate) {
        return await this.service.getProviderStats(providerId, startDate, endDate);
    }
    async bulkUpdateStatus(bulkData) {
        await this.service.bulkUpdateStatus(bulkData.appointmentIds, bulkData.status);
    }
    async bulkCancel(bulkData) {
        await this.service.bulkCancel(bulkData.appointmentIds, bulkData.reason);
    }
    async createEmergencyAppointment(data) {
        return await this.service.createEmergencyAppointment(data);
    }
    async sendAppointmentNotification(id, type) {
        await this.service.sendAppointmentNotification(id, type);
    }
    async exportToCalendar(format = 'ics', startDate, endDate, providerId) {
        return {
            message: 'Calendar export endpoint - implement based on calendar service',
            format,
            startDate,
            endDate,
            providerId
        };
    }
    async importFromCalendar(calendarData) {
        return {
            message: 'Calendar import endpoint - implement based on calendar service',
            dataReceived: !!calendarData
        };
    }
    async getTodaysAppointments(providerId) {
        const today = new Date().toISOString().split('T')[0];
        const params = {
            startDate: today,
            endDate: today,
            providerId
        };
        return await this.service.findAll(params);
    }
    async getWeeklyAppointments(providerId) {
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
    async getUpcomingAppointments(days = 7, participantId) {
        return {
            message: 'Upcoming appointments endpoint - implement repository method',
            days: +days,
            participantId
        };
    }
    async addToWaitingList(appointmentData) {
        return {
            message: 'Add to waiting list endpoint - implement waiting list logic',
            dataReceived: !!appointmentData
        };
    }
    async getWaitingList(date, providerId) {
        return {
            message: 'Get waiting list endpoint - implement waiting list logic',
            date,
            providerId
        };
    }
    async checkResourceAvailability(resourceId, startTime, endTime) {
        return {
            message: 'Resource availability endpoint - implement resource management',
            resourceId,
            startTime,
            endTime
        };
    }
    async getAppointmentsNeedingFollowUp() {
        return {
            message: 'Follow-ups needed endpoint - implement follow-up logic'
        };
    }
    async scheduleFollowUp(originalId, followUpData) {
        return {
            message: 'Schedule follow-up endpoint - implement follow-up scheduling',
            originalId,
            hasData: !!followUpData
        };
    }
    async getAuditLog(appointmentId) {
        return {
            message: 'Audit log endpoint - implement audit tracking',
            appointmentId
        };
    }
    async generateComplianceReport(startDate, endDate) {
        return {
            message: 'Compliance report endpoint - implement compliance reporting',
            startDate,
            endDate
        };
    }
    async duplicateAppointment(id) {
        const originalAppointment = await this.service.findById(id);
        const duplicateData = {
            ...originalAppointment,
            schedule: {
                ...originalAppointment.schedule,
                status: 'scheduled',
                confirmationCode: undefined,
                bookedAt: new Date().toISOString()
            }
        };
        delete duplicateData.id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;
        return await this.service.create(duplicateData);
    }
    async getDashboardSummary(providerId) {
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const params = { providerId };
        const [todaysAppointments, tomorrowsAppointments, stats] = await Promise.all([
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
    async findOverdueAppointments() {
        return {
            message: 'Overdue appointments health check - implement overdue detection'
        };
    }
    async findScheduleConflicts(providerId) {
        return {
            message: 'Schedule conflicts health check - implement conflict detection',
            providerId
        };
    }
    async getNoShowStatistics(startDate, endDate) {
        return {
            message: 'No-show statistics - implement no-show tracking',
            startDate,
            endDate
        };
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointments_dto_1.CreateAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('provider')),
    __param(4, (0, common_1.Query)('client')),
    __param(5, (0, common_1.Query)('startDate')),
    __param(6, (0, common_1.Query)('endDate')),
    __param(7, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointments_dto_1.UpdateAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Get)('search/advanced'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "searchAppointments", null);
__decorate([
    (0, common_1.Get)('confirmation/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findByConfirmationCode", null);
__decorate([
    (0, common_1.Get)('provider/:providerId'),
    __param(0, (0, common_1.Param)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findByProvider", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findByClient", null);
__decorate([
    (0, common_1.Get)('availability/check'),
    __param(0, (0, common_1.Query)('providerId')),
    __param(1, (0, common_1.Query)('startTime')),
    __param(2, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)('availability/slots'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AvailabilityQueryDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findAvailableSlots", null);
__decorate([
    (0, common_1.Get)('schedule/:providerId'),
    __param(0, (0, common_1.Param)('providerId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getProviderSchedule", null);
__decorate([
    (0, common_1.Put)(':id/confirm'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ConfirmAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "confirmAppointment", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CancelAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_1.Put)(':id/reschedule'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RescheduleAppointmentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "rescheduleAppointment", null);
__decorate([
    (0, common_1.Put)(':id/checkin'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CheckInDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "checkIn", null);
__decorate([
    (0, common_1.Post)('recurring'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointments_dto_1.CreateAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createRecurringAppointments", null);
__decorate([
    (0, common_1.Put)(':id/payment/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Post)(':id/payment/process'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ProcessPaymentDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "processPayment", null);
__decorate([
    (0, common_1.Get)('analytics/stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentStats", null);
__decorate([
    (0, common_1.Get)('analytics/provider/:providerId/stats'),
    __param(0, (0, common_1.Param)('providerId')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getProviderStats", null);
__decorate([
    (0, common_1.Put)('bulk/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Put)('bulk/cancel'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "bulkCancel", null);
__decorate([
    (0, common_1.Post)('emergency'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointments_dto_1.CreateAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createEmergencyAppointment", null);
__decorate([
    (0, common_1.Post)(':id/notifications/:type'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "sendAppointmentNotification", null);
__decorate([
    (0, common_1.Get)('calendar/export'),
    __param(0, (0, common_1.Query)('format')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __param(3, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "exportToCalendar", null);
__decorate([
    (0, common_1.Post)('calendar/import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "importFromCalendar", null);
__decorate([
    (0, common_1.Get)('schedule/today'),
    __param(0, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getTodaysAppointments", null);
__decorate([
    (0, common_1.Get)('schedule/week'),
    __param(0, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getWeeklyAppointments", null);
__decorate([
    (0, common_1.Get)('schedule/upcoming'),
    __param(0, (0, common_1.Query)('days')),
    __param(1, (0, common_1.Query)('participantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getUpcomingAppointments", null);
__decorate([
    (0, common_1.Post)('waiting-list'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "addToWaitingList", null);
__decorate([
    (0, common_1.Get)('waiting-list/:date'),
    __param(0, (0, common_1.Param)('date')),
    __param(1, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getWaitingList", null);
__decorate([
    (0, common_1.Get)('resources/availability'),
    __param(0, (0, common_1.Query)('resourceId')),
    __param(1, (0, common_1.Query)('startTime')),
    __param(2, (0, common_1.Query)('endTime')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "checkResourceAvailability", null);
__decorate([
    (0, common_1.Get)('follow-ups/needed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsNeedingFollowUp", null);
__decorate([
    (0, common_1.Post)(':id/follow-up'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_appointments_dto_1.CreateAppointmentsDto]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "scheduleFollowUp", null);
__decorate([
    (0, common_1.Get)(':id/audit-log'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Get)('compliance/report'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "generateComplianceReport", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "duplicateAppointment", null);
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    __param(0, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('health/overdue'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findOverdueAppointments", null);
__decorate([
    (0, common_1.Get)('health/conflicts'),
    __param(0, (0, common_1.Query)('providerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "findScheduleConflicts", null);
__decorate([
    (0, common_1.Get)('health/no-shows'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getNoShowStatistics", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_1.Controller)('appointments'),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map