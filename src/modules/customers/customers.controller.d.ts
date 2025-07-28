import { CustomersService } from './customers.service';
import { CreateCustomersDto } from './dto/create-customers.dto';
import { UpdateCustomersDto } from './dto/update-customers.dto';
declare class UpdateStatusDto {
    status: string;
    reason?: string;
}
declare class UpdateCreditLimitDto {
    creditLimit: number;
    reason?: string;
}
declare class PaymentDto {
    amount: number;
    paymentMethod: string;
    reference?: string;
    notes?: string;
}
declare class LoyaltyPointsDto {
    points: number;
    operation: 'add' | 'subtract' | 'set';
    reason?: string;
}
declare class RedeemPointsDto {
    points: number;
    rewardId: string;
    notes?: string;
}
declare class UpdateSegmentsDto {
    segments: string[];
    reason?: string;
}
declare class MergeCustomersDto {
    primaryCustomerId: string;
    duplicateCustomerIds: string[];
    notes?: string;
}
declare class AdvancedSearchDto {
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
export declare class CustomersController {
    private readonly service;
    constructor(service: CustomersService);
    create(dto: CreateCustomersDto): Promise<any>;
    findAll(page?: number, limit?: number, status?: string, customerType?: string, assignedTo?: string, source?: string, tags?: string, segments?: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateCustomersDto): Promise<any>;
    softDelete(id: string): Promise<void>;
    advancedSearch(query: AdvancedSearchDto): Promise<any>;
    searchCustomers(query: string): Promise<any[]>;
    findByCustomerNumber(customerNumber: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    updateStatus(id: string, statusData: UpdateStatusDto): Promise<void>;
    activateCustomer(id: string): Promise<void>;
    suspendCustomer(id: string, suspendData: {
        reason: string;
    }): Promise<void>;
    updateCreditLimit(id: string, creditData: UpdateCreditLimitDto): Promise<void>;
    recordPayment(id: string, paymentData: PaymentDto): Promise<{
        message: string;
    }>;
    updateLoyaltyPoints(id: string, pointsData: LoyaltyPointsDto): Promise<void>;
    redeemPoints(id: string, redeemData: RedeemPointsDto): Promise<{
        message: string;
    }>;
    updateSegments(id: string, segmentData: UpdateSegmentsDto): Promise<void>;
    getCustomerStats(startDate?: string, endDate?: string): Promise<any>;
    getSegmentationReport(): Promise<{
        message: string;
    }>;
    getLoyaltyReport(): Promise<{
        message: string;
    }>;
    getGeographicDistribution(): Promise<{
        message: string;
    }>;
    getIndustryDistribution(): Promise<{
        message: string;
    }>;
    bulkUpdateStatus(bulkData: {
        customerIds: string[];
        status: string;
    }): Promise<void>;
    bulkAddTags(bulkData: {
        customerIds: string[];
        tags: string[];
    }): Promise<{
        message: string;
        customerIds: number;
        tags: number;
    }>;
    bulkAssign(bulkData: {
        customerIds: string[];
        assigneeId: string;
    }): Promise<{
        message: string;
        customerIds: number;
        assigneeId: string;
    }>;
    mergeCustomers(mergeData: MergeCustomersDto): Promise<{
        message: string;
    }>;
    findDuplicates(checkEmail?: boolean, checkPhone?: boolean, checkName?: boolean): Promise<{
        message: string;
        criteria: {
            email: boolean;
            phone: boolean;
            name: boolean;
        };
    }>;
    getNewCustomers(days?: number): Promise<{
        message: string;
        days: number;
    }>;
    getInactiveCustomers(days?: number): Promise<{
        message: string;
        days: number;
    }>;
    getAtRiskCustomers(): Promise<{
        message: string;
    }>;
    getHighValueCustomers(minValue?: number): Promise<{
        message: string;
        minValue: number;
    }>;
    getCustomersByCity(city: string): Promise<{
        message: string;
        city: string;
    }>;
    getCustomersInRadius(latitude: number, longitude: number, radius: number): Promise<{
        message: string;
        latitude: number;
        longitude: number;
        radius: number;
    }>;
    getCustomersByIndustry(industry: string): Promise<{
        message: string;
        industry: string;
    }>;
    getCustomersByBusinessSize(size: string): Promise<{
        message: string;
        size: string;
    }>;
    getCustomersByRevenue(minRevenue?: number, maxRevenue?: number): Promise<{
        message: string;
        minRevenue: number;
        maxRevenue: number;
    }>;
    getCustomersByCommPreference(preference: string): Promise<{
        message: string;
        preference: string;
    }>;
    getOptedOutCustomers(): Promise<{
        message: string;
    }>;
    getSubscribedCustomers(): Promise<{
        message: string;
    }>;
    getCustomerInsights(id: string): Promise<{
        message: string;
        customerId: string;
    }>;
    getRecommendations(id: string, type: 'products' | 'services' | 'actions'): Promise<{
        message: string;
        customerId: string;
        type: "products" | "services" | "actions";
    }>;
    getSimilarCustomers(id: string, limit?: number): Promise<{
        message: string;
        customerId: string;
        limit: number;
    }>;
    getDataExport(id: string): Promise<{
        message: string;
        customerId: string;
    }>;
    anonymizeCustomer(id: string): Promise<{
        message: string;
        customerId: string;
    }>;
    updateConsentStatus(id: string, consentType: string, consentData: {
        status: boolean;
    }): Promise<{
        message: string;
        customerId: string;
        consentType: string;
        status: boolean;
    }>;
    getAuditLog(id: string): Promise<{
        message: string;
        customerId: string;
    }>;
    getInteractionHistory(id: string, type?: string): Promise<{
        message: string;
        customerId: string;
        type: string;
    }>;
    getPurchaseHistory(id: string): Promise<{
        message: string;
        customerId: string;
    }>;
    getDashboardSummary(assignedTo?: string, timeframe?: string): Promise<{
        summary: {
            total: any;
            active: any;
            newThisMonth: any;
            atRisk: number;
            highValue: any;
        };
        metrics: {
            averageLifetimeValue: any;
            totalRevenue: any;
            conversionRate: number;
            churnRate: number;
        };
        timeframe: string;
        assignedTo: string;
    }>;
    getActivityDashboard(): Promise<{
        message: string;
        recentActivity: any[];
        upcomingTasks: any[];
        notifications: any[];
    }>;
    getDataQualityReport(): Promise<{
        message: string;
        completeness: number;
        accuracy: number;
        consistency: number;
    }>;
    runDuplicatesCheck(): Promise<{
        message: string;
        duplicatesFound: number;
        suggestions: any[];
    }>;
}
export {};
