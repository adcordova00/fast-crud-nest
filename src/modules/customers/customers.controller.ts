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
import { CustomersService } from './customers.service';
import { CreateCustomersDto } from './dto/create-customers.dto';
import { UpdateCustomersDto } from './dto/update-customers.dto';

// DTOs for specific customer endpoints
class UpdateStatusDto {
    status!: string;
    reason?: string;
}

class UpdateCreditLimitDto {
    creditLimit!: number;
    reason?: string;
}

class PaymentDto {
    amount!: number;
    paymentMethod!: string;
    reference?: string;
    notes?: string;
}

class LoyaltyPointsDto {
    points!: number;
    operation!: 'add' | 'subtract' | 'set';
    reason?: string;
}

class RedeemPointsDto {
    points!: number;
    rewardId!: string;
    notes?: string;
}

class UpdateSegmentsDto {
    segments!: string[];
    reason?: string;
}

class AddTagsDto {
    tags!: string[];
}

class BulkActionDto {
    customerIds!: string[];
    action!: string;
    data?: any;
}

class MergeCustomersDto {
    primaryCustomerId!: string;
    duplicateCustomerIds!: string[];
    notes?: string;
}

class AdvancedSearchDto {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    location?: string;
    customerType?: string;
    status?: string;
    industry?: string;
    tags?: string[];
    segments?: string[];
    loyaltyTier?: string;
    minRevenue?: number;
    maxRevenue?: number;
    createdFrom?: string;
    createdTo?: string;
    lastActivityFrom?: string;
    lastActivityTo?: string;
    source?: string;
    assignedTo?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

@Controller('customers')
export class CustomersController {
    constructor(private readonly service: CustomersService) { }

    /**
     * Standard CRUD Operations
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateCustomersDto) {
        return await this.service.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('status') status?: string,
        @Query('type') customerType?: string,
        @Query('assignedTo') assignedTo?: string,
        @Query('source') source?: string,
        @Query('tags') tags?: string,
        @Query('segments') segments?: string
    ) {
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

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateCustomersDto
    ) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softDelete(@Param('id') id: string) {
        await this.service.softDelete(id);
    }

    /**
     * Customer Identification and Search
     */
    @Get('search/advanced')
    async advancedSearch(@Query() query: AdvancedSearchDto) {
        return await this.service.advancedSearch(query);
    }

    @Get('search/query/:query')
    async searchCustomers(@Param('query') query: string) {
        return await this.service.searchCustomers(query);
    }

    @Get('number/:customerNumber')
    async findByCustomerNumber(@Param('customerNumber') customerNumber: string) {
        return await this.service.findByCustomerNumber(customerNumber);
    }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string) {
        return await this.service.findByEmail(email);
    }

    /**
     * Customer Status Management
     */
    @Put(':id/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateStatus(
        @Param('id') id: string,
        @Body() statusData: UpdateStatusDto
    ) {
        await this.service.updateStatus(id, statusData.status, statusData.reason);
    }

    @Put(':id/activate')
    @HttpCode(HttpStatus.NO_CONTENT)
    async activateCustomer(@Param('id') id: string) {
        await this.service.activateCustomer(id);
    }

    @Put(':id/suspend')
    @HttpCode(HttpStatus.NO_CONTENT)
    async suspendCustomer(
        @Param('id') id: string,
        @Body() suspendData: { reason: string }
    ) {
        await this.service.suspendCustomer(id, suspendData.reason);
    }

    /**
     * Financial Management
     */
    @Put(':id/credit-limit')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateCreditLimit(
        @Param('id') id: string,
        @Body() creditData: UpdateCreditLimitDto
    ) {
        await this.service.updateCreditLimit(id, creditData.creditLimit);
    }

    @Post(':id/payments')
    async recordPayment(
        @Param('id') id: string,
        @Body() paymentData: PaymentDto
    ) {
        await this.service.recordPayment(id, paymentData.amount, paymentData.paymentMethod);
        return { message: 'Payment recorded successfully' };
    }

    /**
     * Loyalty and Rewards Management
     */
    @Put(':id/loyalty/points')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateLoyaltyPoints(
        @Param('id') id: string,
        @Body() pointsData: LoyaltyPointsDto
    ) {
        await this.service.updateLoyaltyPoints(id, pointsData.points, pointsData.operation);
    }

    @Post(':id/loyalty/redeem')
    async redeemPoints(
        @Param('id') id: string,
        @Body() redeemData: RedeemPointsDto
    ) {
        await this.service.redeemPoints(id, redeemData.points, redeemData.rewardId);
        return { message: 'Points redeemed successfully' };
    }

    /**
     * Segmentation Management
     */
    @Put(':id/segments')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateSegments(
        @Param('id') id: string,
        @Body() segmentData: UpdateSegmentsDto
    ) {
        await this.service.updateSegments(id, segmentData.segments);
    }

    /**
     * Analytics and Reporting
     */
    @Get('analytics/stats')
    async getCustomerStats(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return await this.service.getCustomerStats(startDate, endDate);
    }

    @Get('analytics/segments')
    async getSegmentationReport() {
        // Implementation would use repository method
        return { message: 'Segmentation report endpoint - implement repository method' };
    }

    @Get('analytics/loyalty')
    async getLoyaltyReport() {
        // Implementation would use repository method
        return { message: 'Loyalty report endpoint - implement repository method' };
    }

    @Get('analytics/geographic')
    async getGeographicDistribution() {
        // Implementation would use repository method
        return { message: 'Geographic distribution endpoint - implement repository method' };
    }

    @Get('analytics/industry')
    async getIndustryDistribution() {
        // Implementation would use repository method
        return { message: 'Industry distribution endpoint - implement repository method' };
    }

    /**
     * Bulk Operations
     */
    @Put('bulk/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkUpdateStatus(@Body() bulkData: { customerIds: string[]; status: string }) {
        await this.service.bulkUpdateStatus(bulkData.customerIds, bulkData.status);
    }

    @Put('bulk/tags/add')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkAddTags(@Body() bulkData: { customerIds: string[]; tags: string[] }) {
        // Implementation would use repository method
        return { 
            message: 'Bulk add tags endpoint - implement repository method',
            customerIds: bulkData.customerIds.length,
            tags: bulkData.tags.length
        };
    }

    @Put('bulk/assign')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkAssign(@Body() bulkData: { customerIds: string[]; assigneeId: string }) {
        // Implementation would use repository method
        return { 
            message: 'Bulk assign endpoint - implement repository method',
            customerIds: bulkData.customerIds.length,
            assigneeId: bulkData.assigneeId
        };
    }

    /**
     * Data Management
     */
    @Post('merge')
    async mergeCustomers(@Body() mergeData: MergeCustomersDto) {
        await this.service.mergeCustomers(mergeData.primaryCustomerId, mergeData.duplicateCustomerIds);
        return { message: 'Customers merged successfully' };
    }

    @Get('duplicates')
    async findDuplicates(
        @Query('email') checkEmail = true,
        @Query('phone') checkPhone = true,
        @Query('name') checkName = false
    ) {
        // Implementation would use repository method
        return { 
            message: 'Find duplicates endpoint - implement repository method',
            criteria: { email: checkEmail, phone: checkPhone, name: checkName }
        };
    }

    /**
     * Customer Lifecycle Queries
     */
    @Get('lifecycle/new')
    async getNewCustomers(@Query('days') days = 30) {
        // Implementation would use repository method
        return { 
            message: 'New customers endpoint - implement repository method',
            days: +days
        };
    }

    @Get('lifecycle/inactive')
    async getInactiveCustomers(@Query('days') days = 90) {
        // Implementation would use repository method
        return { 
            message: 'Inactive customers endpoint - implement repository method',
            days: +days
        };
    }

    @Get('lifecycle/at-risk')
    async getAtRiskCustomers() {
        // Implementation would use repository method
        return { message: 'At-risk customers endpoint - implement repository method' };
    }

    @Get('lifecycle/high-value')
    async getHighValueCustomers(@Query('minValue') minValue = 1000) {
        // Implementation would use repository method
        return { 
            message: 'High value customers endpoint - implement repository method',
            minValue: +minValue
        };
    }

    /**
     * Location-based Queries
     */
    @Get('location/city/:city')
    async getCustomersByCity(@Param('city') city: string) {
        // Implementation would use repository method
        return { 
            message: 'Customers by city endpoint - implement repository method',
            city
        };
    }

    @Get('location/radius')
    async getCustomersInRadius(
        @Query('lat') latitude: number,
        @Query('lng') longitude: number,
        @Query('radius') radius: number
    ) {
        // Implementation would use repository method
        return { 
            message: 'Customers in radius endpoint - implement repository method',
            latitude: +latitude,
            longitude: +longitude,
            radius: +radius
        };
    }

    /**
     * Business Intelligence
     */
    @Get('business/industry/:industry')
    async getCustomersByIndustry(@Param('industry') industry: string) {
        // Implementation would use repository method
        return { 
            message: 'Customers by industry endpoint - implement repository method',
            industry
        };
    }

    @Get('business/size/:size')
    async getCustomersByBusinessSize(@Param('size') size: string) {
        // Implementation would use repository method
        return { 
            message: 'Customers by business size endpoint - implement repository method',
            size
        };
    }

    @Get('business/revenue')
    async getCustomersByRevenue(
        @Query('min') minRevenue?: number,
        @Query('max') maxRevenue?: number
    ) {
        // Implementation would use repository method
        return { 
            message: 'Customers by revenue endpoint - implement repository method',
            minRevenue,
            maxRevenue
        };
    }

    /**
     * Communication and Marketing
     */
    @Get('communication/preferences/:preference')
    async getCustomersByCommPreference(@Param('preference') preference: string) {
        // Implementation would use repository method
        return { 
            message: 'Customers by communication preference endpoint - implement repository method',
            preference
        };
    }

    @Get('marketing/opted-out')
    async getOptedOutCustomers() {
        // Implementation would use repository method
        return { message: 'Opted out customers endpoint - implement repository method' };
    }

    @Get('marketing/subscribed')
    async getSubscribedCustomers() {
        // Implementation would use repository method
        return { message: 'Subscribed customers endpoint - implement repository method' };
    }

    /**
     * Customer Insights and AI
     */
    @Get(':id/insights')
    async getCustomerInsights(@Param('id') id: string) {
        // Implementation would use AI/ML repository methods
        return { 
            message: 'Customer insights endpoint - implement AI/ML integration',
            customerId: id
        };
    }

    @Get(':id/recommendations/:type')
    async getRecommendations(
        @Param('id') id: string,
        @Param('type') type: 'products' | 'services' | 'actions'
    ) {
        // Implementation would use AI/ML repository methods
        return { 
            message: 'Customer recommendations endpoint - implement AI/ML integration',
            customerId: id,
            type
        };
    }

    @Get(':id/similar')
    async getSimilarCustomers(
        @Param('id') id: string,
        @Query('limit') limit = 10
    ) {
        // Implementation would use AI/ML repository methods
        return { 
            message: 'Similar customers endpoint - implement AI/ML integration',
            customerId: id,
            limit: +limit
        };
    }

    /**
     * Compliance and Privacy
     */
    @Get(':id/data-export')
    async getDataExport(@Param('id') id: string) {
        // Implementation for GDPR compliance
        return { 
            message: 'Data export endpoint - implement GDPR compliance',
            customerId: id
        };
    }

    @Post(':id/anonymize')
    @HttpCode(HttpStatus.NO_CONTENT)
    async anonymizeCustomer(@Param('id') id: string) {
        // Implementation for GDPR right to be forgotten
        return { 
            message: 'Anonymize customer endpoint - implement GDPR compliance',
            customerId: id
        };
    }

    @Put(':id/consent/:type')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateConsentStatus(
        @Param('id') id: string,
        @Param('type') consentType: string,
        @Body() consentData: { status: boolean }
    ) {
        // Implementation for consent management
        return { 
            message: 'Update consent endpoint - implement consent management',
            customerId: id,
            consentType,
            status: consentData.status
        };
    }

    /**
     * Audit and History
     */
    @Get(':id/audit-log')
    async getAuditLog(@Param('id') id: string) {
        // Implementation would use repository method
        return { 
            message: 'Audit log endpoint - implement audit tracking',
            customerId: id
        };
    }

    @Get(':id/interactions')
    async getInteractionHistory(
        @Param('id') id: string,
        @Query('type') type?: string
    ) {
        // Implementation would use repository method
        return { 
            message: 'Interaction history endpoint - implement interaction tracking',
            customerId: id,
            type
        };
    }

    @Get(':id/purchases')
    async getPurchaseHistory(@Param('id') id: string) {
        // Implementation would use repository method
        return { 
            message: 'Purchase history endpoint - implement purchase tracking',
            customerId: id
        };
    }

    /**
     * Dashboard and Overview
     */
    @Get('dashboard/summary')
    async getDashboardSummary(
        @Query('assignedTo') assignedTo?: string,
        @Query('timeframe') timeframe = '30'
    ) {
        const stats = await this.service.getCustomerStats();
        
        return {
            summary: {
                total: stats.total,
                active: stats.active,
                newThisMonth: stats.new,
                atRisk: 0, // Would implement with repository method
                highValue: stats.vip
            },
            metrics: {
                averageLifetimeValue: stats.averageLifetimeValue,
                totalRevenue: stats.totalRevenue,
                conversionRate: 0, // Would calculate from data
                churnRate: 0 // Would calculate from data
            },
            timeframe: `${timeframe} days`,
            assignedTo
        };
    }

    @Get('dashboard/activity')
    async getActivityDashboard() {
        return { 
            message: 'Activity dashboard endpoint - implement activity tracking',
            recentActivity: [],
            upcomingTasks: [],
            notifications: []
        };
    }

    /**
     * Health Checks and Validation
     */
    @Get('health/data-quality')
    async getDataQualityReport() {
        return { 
            message: 'Data quality report endpoint - implement data validation',
            completeness: 0,
            accuracy: 0,
            consistency: 0
        };
    }

    @Get('health/duplicates-check')
    async runDuplicatesCheck() {
        return { 
            message: 'Duplicates check endpoint - implement duplicate detection',
            duplicatesFound: 0,
            suggestions: []
        };
    }
} 