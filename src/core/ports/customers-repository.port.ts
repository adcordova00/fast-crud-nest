import { CreateCustomersDto } from '../../modules/customers/dto/create-customers.dto';

export const CUSTOMERS_REPOSITORY_PORT = 'CustomersRepositoryPort';

export interface CustomersRepositoryPort {
    // Standard CRUD operations
    create(data: CreateCustomersDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    softDelete(id: string): Promise<void>;

    // Customer identification and search
    findByCustomerNumber(customerNumber: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findByPhone(phone: string): Promise<any>;
    findByTaxId(taxId: string): Promise<any>;
    findByName(firstName: string, lastName: string): Promise<any[]>;
    findByCompanyName(companyName: string): Promise<any[]>;
    searchCustomers(query: string): Promise<any[]>;

    // Customer status and type management
    findByStatus(status: string): Promise<any[]>;
    findByType(customerType: string): Promise<any[]>;
    updateStatus(id: string, status: string, reason?: string): Promise<void>;
    activateCustomer(id: string): Promise<void>;
    deactivateCustomer(id: string, reason?: string): Promise<void>;
    suspendCustomer(id: string, reason: string): Promise<void>;
    markAsVip(id: string): Promise<void>;

    // Geographic and location-based queries
    findByLocation(city?: string, state?: string, country?: string): Promise<any[]>;
    findInRadius(latitude: number, longitude: number, radiusKm: number): Promise<any[]>;
    findByZipCode(zipCode: string): Promise<any[]>;
    findByTimezone(timezone: string): Promise<any[]>;

    // Business-specific queries
    findByIndustry(industry: string): Promise<any[]>;
    findByBusinessSize(size: string): Promise<any[]>;
    findByRevenue(minRevenue?: number, maxRevenue?: number): Promise<any[]>;
    findByEmployeeCount(minEmployees?: number, maxEmployees?: number): Promise<any[]>;
    findByAssignee(assigneeId: string): Promise<any[]>;

    // Financial operations and queries
    findByPaymentTerms(paymentTerms: string): Promise<any[]>;
    findByCreditRating(creditRating: string): Promise<any[]>;
    findByOutstandingBalance(minBalance?: number, maxBalance?: number): Promise<any[]>;
    updateCreditLimit(id: string, newLimit: number): Promise<void>;
    recordPayment(id: string, amount: number, paymentMethod: string): Promise<void>;
    updateFinancialInfo(id: string, financialData: any): Promise<void>;
    findOverdueCustomers(days?: number): Promise<any[]>;
    findHighValueCustomers(minValue: number): Promise<any[]>;

    // Loyalty and rewards management
    findByLoyaltyTier(tier: string): Promise<any[]>;
    updateLoyaltyPoints(id: string, points: number, operation: 'add' | 'subtract' | 'set'): Promise<void>;
    redeemPoints(id: string, points: number, rewardId: string): Promise<void>;
    addReward(id: string, reward: any): Promise<void>;
    upgradeTier(id: string, newTier: string): Promise<void>;
    findEligibleForUpgrade(): Promise<any[]>;
    recordReferral(referrerId: string, referredId: string): Promise<void>;

    // Segmentation and analytics
    findBySegment(segment: string): Promise<any[]>;
    findByTags(tags: string[]): Promise<any[]>;
    updateSegments(id: string, segments: string[]): Promise<void>;
    addTags(id: string, tags: string[]): Promise<void>;
    removeTags(id: string, tags: string[]): Promise<void>;
    findByEngagementScore(minScore?: number, maxScore?: number): Promise<any[]>;
    findByRiskScore(minScore?: number, maxScore?: number): Promise<any[]>;
    findAtRiskCustomers(): Promise<any[]>;
    findHighValueProspects(): Promise<any[]>;

    // Communication and preferences
    findByCommunicationPreference(preference: string): Promise<any[]>;
    updateCommunicationPreferences(id: string, preferences: any): Promise<void>;
    findOptedOutCustomers(): Promise<any[]>;
    findSubscribedToMarketing(): Promise<any[]>;
    recordCommunication(id: string, communication: any): Promise<void>;
    getMessageHistory(id: string): Promise<any[]>;

    // Interaction and activity tracking
    recordInteraction(id: string, interaction: any): Promise<void>;
    getInteractionHistory(id: string, type?: string): Promise<any[]>;
    updateLastActivity(id: string, activityType: string): Promise<void>;
    findInactiveCustomers(days: number): Promise<any[]>;
    findActiveCustomers(days: number): Promise<any[]>;
    getMostActiveCustomers(limit?: number): Promise<any[]>;

    // Purchase and order history
    addPurchaseHistory(id: string, purchase: any): Promise<void>;
    getPurchaseHistory(id: string): Promise<any[]>;
    updateLifetimeValue(id: string, value: number): Promise<void>;
    calculateAverageOrderValue(id: string): Promise<number>;
    findByPurchaseValue(minValue?: number, maxValue?: number): Promise<any[]>;
    findByLastPurchase(days: number): Promise<any[]>;
    findTopCustomersBySpending(limit?: number): Promise<any[]>;

    // Customer lifecycle management
    findNewCustomers(days?: number): Promise<any[]>;
    findReturningCustomers(): Promise<any[]>;
    findOneTimeCustomers(): Promise<any[]>;
    findChurnedCustomers(days: number): Promise<any[]>;
    predictChurnRisk(id: string): Promise<number>;
    calculateCustomerLifetimeValue(id: string): Promise<number>;

    // Advanced analytics and reporting
    getCustomerStats(startDate?: string, endDate?: string): Promise<{
        total: number;
        active: number;
        inactive: number;
        new: number;
        churned: number;
        vip: number;
        averageLifetimeValue: number;
        totalRevenue: number;
    }>;
    getSegmentationReport(): Promise<any[]>;
    getLoyaltyReport(): Promise<any>;
    getEngagementReport(startDate?: string, endDate?: string): Promise<any>;
    getRevenueByCustomer(customerId?: string): Promise<any>;
    getGeographicDistribution(): Promise<any[]>;
    getIndustryDistribution(): Promise<any[]>;

    // Campaign and marketing operations
    findByCampaign(campaignId: string): Promise<any[]>;
    addToCampaign(customerIds: string[], campaignId: string): Promise<void>;
    removeFromCampaign(customerIds: string[], campaignId: string): Promise<void>;
    recordCampaignResponse(id: string, campaignId: string, response: string): Promise<void>;
    findCampaignResponders(campaignId: string): Promise<any[]>;
    findEligibleForCampaign(criteria: any): Promise<any[]>;

    // Advanced search and filtering
    advancedSearch(criteria: {
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
    }): Promise<{
        customers: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;

    // Bulk operations
    bulkUpdate(customerIds: string[], updateData: any): Promise<void>;
    bulkUpdateStatus(customerIds: string[], status: string): Promise<void>;
    bulkAddTags(customerIds: string[], tags: string[]): Promise<void>;
    bulkRemoveTags(customerIds: string[], tags: string[]): Promise<void>;
    bulkAssign(customerIds: string[], assigneeId: string): Promise<void>;
    bulkSegment(customerIds: string[], segment: string): Promise<void>;
    bulkDelete(customerIds: string[]): Promise<void>;

    // Data management and cleanup
    mergeCustomers(primaryId: string, duplicateIds: string[]): Promise<void>;
    findDuplicates(criteria?: { email?: boolean; phone?: boolean; name?: boolean }): Promise<Array<{
        group: any[];
        matchCriteria: string;
    }>>;
    validateData(id: string): Promise<{ valid: boolean; errors: string[] }>;
    enrichCustomerData(id: string, dataSource: string): Promise<void>;
    archiveInactiveCustomers(inactiveDays: number): Promise<number>;

    // Integration and external systems
    syncWithCrm(customerId: string, crmType: string): Promise<void>;
    exportCustomers(customerIds: string[], format: 'csv' | 'excel' | 'json'): Promise<string>;
    importCustomers(data: any[], options?: { validate?: boolean; merge?: boolean }): Promise<{
        success: number;
        failed: number;
        duplicates: number;
        errors: any[];
    }>;

    // Compliance and privacy
    getDataExport(id: string): Promise<any>; // GDPR compliance
    anonymizeCustomer(id: string): Promise<void>; // GDPR right to be forgotten
    updateConsentStatus(id: string, consentType: string, status: boolean): Promise<void>;
    findByConsentStatus(consentType: string, status: boolean): Promise<any[]>;
    getAuditLog(customerId: string): Promise<any[]>;

    // Relationship management
    addRelationship(customerId: string, relatedCustomerId: string, relationshipType: string): Promise<void>;
    getRelatedCustomers(id: string, relationshipType?: string): Promise<any[]>;
    updateRelationship(customerId: string, relatedCustomerId: string, newType: string): Promise<void>;
    removeRelationship(customerId: string, relatedCustomerId: string): Promise<void>;

    // AI and ML integration
    getRecommendations(id: string, type: 'products' | 'services' | 'actions'): Promise<any[]>;
    updatePredictiveScores(id: string, scores: any): Promise<void>;
    findSimilarCustomers(id: string, limit?: number): Promise<any[]>;
    getCustomerInsights(id: string): Promise<any>;

    // Performance and monitoring
    getPerformanceMetrics(): Promise<{
        totalQueries: number;
        averageResponseTime: number;
        cacheHitRate: number;
        lastUpdated: string;
    }>;
    refreshCustomerCache(id?: string): Promise<void>;
    validateDataIntegrity(): Promise<{ valid: boolean; issues: any[] }>;
} 