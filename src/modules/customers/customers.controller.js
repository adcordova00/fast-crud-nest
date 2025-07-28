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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const customers_service_1 = require("./customers.service");
const create_customers_dto_1 = require("./dto/create-customers.dto");
const update_customers_dto_1 = require("./dto/update-customers.dto");
class UpdateStatusDto {
}
class UpdateCreditLimitDto {
}
class PaymentDto {
}
class LoyaltyPointsDto {
}
class RedeemPointsDto {
}
class UpdateSegmentsDto {
}
class AddTagsDto {
}
class BulkActionDto {
}
class MergeCustomersDto {
}
class AdvancedSearchDto {
}
let CustomersController = class CustomersController {
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return await this.service.create(dto);
    }
    async findAll(page = 1, limit = 10, status, customerType, assignedTo, source, tags, segments) {
        const params = {
            page: +page,
            limit: +limit,
            status,
            customerType,
            assignedTo,
            source,
            tags: tags ? tags.split(',') : undefined,
            segments: segments ? segments.split(',') : undefined
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
    async advancedSearch(query) {
        return await this.service.advancedSearch(query);
    }
    async searchCustomers(query) {
        return await this.service.searchCustomers(query);
    }
    async findByCustomerNumber(customerNumber) {
        return await this.service.findByCustomerNumber(customerNumber);
    }
    async findByEmail(email) {
        return await this.service.findByEmail(email);
    }
    async updateStatus(id, statusData) {
        await this.service.updateStatus(id, statusData.status, statusData.reason);
    }
    async activateCustomer(id) {
        await this.service.activateCustomer(id);
    }
    async suspendCustomer(id, suspendData) {
        await this.service.suspendCustomer(id, suspendData.reason);
    }
    async updateCreditLimit(id, creditData) {
        await this.service.updateCreditLimit(id, creditData.creditLimit);
    }
    async recordPayment(id, paymentData) {
        await this.service.recordPayment(id, paymentData.amount, paymentData.paymentMethod);
        return { message: 'Payment recorded successfully' };
    }
    async updateLoyaltyPoints(id, pointsData) {
        await this.service.updateLoyaltyPoints(id, pointsData.points, pointsData.operation);
    }
    async redeemPoints(id, redeemData) {
        await this.service.redeemPoints(id, redeemData.points, redeemData.rewardId);
        return { message: 'Points redeemed successfully' };
    }
    async updateSegments(id, segmentData) {
        await this.service.updateSegments(id, segmentData.segments);
    }
    async getCustomerStats(startDate, endDate) {
        return await this.service.getCustomerStats(startDate, endDate);
    }
    async getSegmentationReport() {
        return { message: 'Segmentation report endpoint - implement repository method' };
    }
    async getLoyaltyReport() {
        return { message: 'Loyalty report endpoint - implement repository method' };
    }
    async getGeographicDistribution() {
        return { message: 'Geographic distribution endpoint - implement repository method' };
    }
    async getIndustryDistribution() {
        return { message: 'Industry distribution endpoint - implement repository method' };
    }
    async bulkUpdateStatus(bulkData) {
        await this.service.bulkUpdateStatus(bulkData.customerIds, bulkData.status);
    }
    async bulkAddTags(bulkData) {
        return {
            message: 'Bulk add tags endpoint - implement repository method',
            customerIds: bulkData.customerIds.length,
            tags: bulkData.tags.length
        };
    }
    async bulkAssign(bulkData) {
        return {
            message: 'Bulk assign endpoint - implement repository method',
            customerIds: bulkData.customerIds.length,
            assigneeId: bulkData.assigneeId
        };
    }
    async mergeCustomers(mergeData) {
        await this.service.mergeCustomers(mergeData.primaryCustomerId, mergeData.duplicateCustomerIds);
        return { message: 'Customers merged successfully' };
    }
    async findDuplicates(checkEmail = true, checkPhone = true, checkName = false) {
        return {
            message: 'Find duplicates endpoint - implement repository method',
            criteria: { email: checkEmail, phone: checkPhone, name: checkName }
        };
    }
    async getNewCustomers(days = 30) {
        return {
            message: 'New customers endpoint - implement repository method',
            days: +days
        };
    }
    async getInactiveCustomers(days = 90) {
        return {
            message: 'Inactive customers endpoint - implement repository method',
            days: +days
        };
    }
    async getAtRiskCustomers() {
        return { message: 'At-risk customers endpoint - implement repository method' };
    }
    async getHighValueCustomers(minValue = 1000) {
        return {
            message: 'High value customers endpoint - implement repository method',
            minValue: +minValue
        };
    }
    async getCustomersByCity(city) {
        return {
            message: 'Customers by city endpoint - implement repository method',
            city
        };
    }
    async getCustomersInRadius(latitude, longitude, radius) {
        return {
            message: 'Customers in radius endpoint - implement repository method',
            latitude: +latitude,
            longitude: +longitude,
            radius: +radius
        };
    }
    async getCustomersByIndustry(industry) {
        return {
            message: 'Customers by industry endpoint - implement repository method',
            industry
        };
    }
    async getCustomersByBusinessSize(size) {
        return {
            message: 'Customers by business size endpoint - implement repository method',
            size
        };
    }
    async getCustomersByRevenue(minRevenue, maxRevenue) {
        return {
            message: 'Customers by revenue endpoint - implement repository method',
            minRevenue,
            maxRevenue
        };
    }
    async getCustomersByCommPreference(preference) {
        return {
            message: 'Customers by communication preference endpoint - implement repository method',
            preference
        };
    }
    async getOptedOutCustomers() {
        return { message: 'Opted out customers endpoint - implement repository method' };
    }
    async getSubscribedCustomers() {
        return { message: 'Subscribed customers endpoint - implement repository method' };
    }
    async getCustomerInsights(id) {
        return {
            message: 'Customer insights endpoint - implement AI/ML integration',
            customerId: id
        };
    }
    async getRecommendations(id, type) {
        return {
            message: 'Customer recommendations endpoint - implement AI/ML integration',
            customerId: id,
            type
        };
    }
    async getSimilarCustomers(id, limit = 10) {
        return {
            message: 'Similar customers endpoint - implement AI/ML integration',
            customerId: id,
            limit: +limit
        };
    }
    async getDataExport(id) {
        return {
            message: 'Data export endpoint - implement GDPR compliance',
            customerId: id
        };
    }
    async anonymizeCustomer(id) {
        return {
            message: 'Anonymize customer endpoint - implement GDPR compliance',
            customerId: id
        };
    }
    async updateConsentStatus(id, consentType, consentData) {
        return {
            message: 'Update consent endpoint - implement consent management',
            customerId: id,
            consentType,
            status: consentData.status
        };
    }
    async getAuditLog(id) {
        return {
            message: 'Audit log endpoint - implement audit tracking',
            customerId: id
        };
    }
    async getInteractionHistory(id, type) {
        return {
            message: 'Interaction history endpoint - implement interaction tracking',
            customerId: id,
            type
        };
    }
    async getPurchaseHistory(id) {
        return {
            message: 'Purchase history endpoint - implement purchase tracking',
            customerId: id
        };
    }
    async getDashboardSummary(assignedTo, timeframe = '30') {
        const stats = await this.service.getCustomerStats();
        return {
            summary: {
                total: stats.total,
                active: stats.active,
                newThisMonth: stats.new,
                atRisk: 0,
                highValue: stats.vip
            },
            metrics: {
                averageLifetimeValue: stats.averageLifetimeValue,
                totalRevenue: stats.totalRevenue,
                conversionRate: 0,
                churnRate: 0
            },
            timeframe: `${timeframe} days`,
            assignedTo
        };
    }
    async getActivityDashboard() {
        return {
            message: 'Activity dashboard endpoint - implement activity tracking',
            recentActivity: [],
            upcomingTasks: [],
            notifications: []
        };
    }
    async getDataQualityReport() {
        return {
            message: 'Data quality report endpoint - implement data validation',
            completeness: 0,
            accuracy: 0,
            consistency: 0
        };
    }
    async runDuplicatesCheck() {
        return {
            message: 'Duplicates check endpoint - implement duplicate detection',
            duplicatesFound: 0,
            suggestions: []
        };
    }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customers_dto_1.CreateCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('assignedTo')),
    __param(5, (0, common_1.Query)('source')),
    __param(6, (0, common_1.Query)('tags')),
    __param(7, (0, common_1.Query)('segments')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customers_dto_1.UpdateCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Get)('search/advanced'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AdvancedSearchDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "advancedSearch", null);
__decorate([
    (0, common_1.Get)('search/query/:query'),
    __param(0, (0, common_1.Param)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "searchCustomers", null);
__decorate([
    (0, common_1.Get)('number/:customerNumber'),
    __param(0, (0, common_1.Param)('customerNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findByCustomerNumber", null);
__decorate([
    (0, common_1.Get)('email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findByEmail", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStatusDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/activate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "activateCustomer", null);
__decorate([
    (0, common_1.Put)(':id/suspend'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "suspendCustomer", null);
__decorate([
    (0, common_1.Put)(':id/credit-limit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCreditLimitDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateCreditLimit", null);
__decorate([
    (0, common_1.Post)(':id/payments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, PaymentDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Put)(':id/loyalty/points'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, LoyaltyPointsDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateLoyaltyPoints", null);
__decorate([
    (0, common_1.Post)(':id/loyalty/redeem'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, RedeemPointsDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "redeemPoints", null);
__decorate([
    (0, common_1.Put)(':id/segments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateSegmentsDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateSegments", null);
__decorate([
    (0, common_1.Get)('analytics/stats'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerStats", null);
__decorate([
    (0, common_1.Get)('analytics/segments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getSegmentationReport", null);
__decorate([
    (0, common_1.Get)('analytics/loyalty'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getLoyaltyReport", null);
__decorate([
    (0, common_1.Get)('analytics/geographic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getGeographicDistribution", null);
__decorate([
    (0, common_1.Get)('analytics/industry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getIndustryDistribution", null);
__decorate([
    (0, common_1.Put)('bulk/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Put)('bulk/tags/add'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "bulkAddTags", null);
__decorate([
    (0, common_1.Put)('bulk/assign'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "bulkAssign", null);
__decorate([
    (0, common_1.Post)('merge'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MergeCustomersDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "mergeCustomers", null);
__decorate([
    (0, common_1.Get)('duplicates'),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Query)('phone')),
    __param(2, (0, common_1.Query)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findDuplicates", null);
__decorate([
    (0, common_1.Get)('lifecycle/new'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getNewCustomers", null);
__decorate([
    (0, common_1.Get)('lifecycle/inactive'),
    __param(0, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getInactiveCustomers", null);
__decorate([
    (0, common_1.Get)('lifecycle/at-risk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAtRiskCustomers", null);
__decorate([
    (0, common_1.Get)('lifecycle/high-value'),
    __param(0, (0, common_1.Query)('minValue')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getHighValueCustomers", null);
__decorate([
    (0, common_1.Get)('location/city/:city'),
    __param(0, (0, common_1.Param)('city')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersByCity", null);
__decorate([
    (0, common_1.Get)('location/radius'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersInRadius", null);
__decorate([
    (0, common_1.Get)('business/industry/:industry'),
    __param(0, (0, common_1.Param)('industry')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersByIndustry", null);
__decorate([
    (0, common_1.Get)('business/size/:size'),
    __param(0, (0, common_1.Param)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersByBusinessSize", null);
__decorate([
    (0, common_1.Get)('business/revenue'),
    __param(0, (0, common_1.Query)('min')),
    __param(1, (0, common_1.Query)('max')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersByRevenue", null);
__decorate([
    (0, common_1.Get)('communication/preferences/:preference'),
    __param(0, (0, common_1.Param)('preference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomersByCommPreference", null);
__decorate([
    (0, common_1.Get)('marketing/opted-out'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getOptedOutCustomers", null);
__decorate([
    (0, common_1.Get)('marketing/subscribed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getSubscribedCustomers", null);
__decorate([
    (0, common_1.Get)(':id/insights'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getCustomerInsights", null);
__decorate([
    (0, common_1.Get)(':id/recommendations/:type'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Get)(':id/similar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getSimilarCustomers", null);
__decorate([
    (0, common_1.Get)(':id/data-export'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getDataExport", null);
__decorate([
    (0, common_1.Post)(':id/anonymize'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "anonymizeCustomer", null);
__decorate([
    (0, common_1.Put)(':id/consent/:type'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "updateConsentStatus", null);
__decorate([
    (0, common_1.Get)(':id/audit-log'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getAuditLog", null);
__decorate([
    (0, common_1.Get)(':id/interactions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getInteractionHistory", null);
__decorate([
    (0, common_1.Get)(':id/purchases'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getPurchaseHistory", null);
__decorate([
    (0, common_1.Get)('dashboard/summary'),
    __param(0, (0, common_1.Query)('assignedTo')),
    __param(1, (0, common_1.Query)('timeframe')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getDashboardSummary", null);
__decorate([
    (0, common_1.Get)('dashboard/activity'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getActivityDashboard", null);
__decorate([
    (0, common_1.Get)('health/data-quality'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getDataQualityReport", null);
__decorate([
    (0, common_1.Get)('health/duplicates-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "runDuplicatesCheck", null);
exports.CustomersController = CustomersController = __decorate([
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map