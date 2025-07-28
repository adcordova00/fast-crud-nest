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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const customers_repository_port_1 = require("../../core/ports/customers-repository.port");
const validation_exception_1 = require("../../core/exceptions/validation.exception");
const fast_crud_exception_1 = require("../../core/exceptions/fast-crud.exception");
let CustomersService = class CustomersService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            console.log('[FAST-CRUD] CustomersService.create called');
            if (dto.customerNumber) {
                const existingCustomer = await this.repository.findByCustomerNumber(dto.customerNumber);
                if (existingCustomer) {
                    throw new validation_exception_1.FastCrudValidationException('Customer number already exists', {
                        customerNumber: dto.customerNumber
                    });
                }
            }
            if (dto.contact?.primaryEmail) {
                const existingEmail = await this.repository.findByEmail(dto.contact.primaryEmail);
                if (existingEmail) {
                    throw new validation_exception_1.FastCrudValidationException('Email already exists', {
                        email: dto.contact.primaryEmail
                    });
                }
            }
            if (dto.customerType === 'business' && dto.business?.taxId) {
                const existingTaxId = await this.repository.findByTaxId(dto.business.taxId);
                if (existingTaxId) {
                    throw new validation_exception_1.FastCrudValidationException('Tax ID already exists', {
                        taxId: dto.business.taxId
                    });
                }
            }
            if (dto.customerType === 'business') {
                if (!dto.business?.companyName) {
                    throw new validation_exception_1.FastCrudValidationException('Company name is required for business customers');
                }
            }
            else {
                if (!dto.personal?.firstName || !dto.personal?.lastName) {
                    throw new validation_exception_1.FastCrudValidationException('First name and last name are required for individual customers');
                }
            }
            if (dto.contact?.allowMarketing === false && dto.preferences?.notifications?.marketing === true) {
                throw new validation_exception_1.FastCrudValidationException('Marketing notifications conflict with communication preferences');
            }
            if (dto.financial?.creditLimit && dto.financial?.creditLimit < 0) {
                throw new validation_exception_1.FastCrudValidationException('Credit limit cannot be negative');
            }
            if (!dto.customerNumber) {
                dto.customerNumber = await this.generateCustomerNumber(dto.customerType);
            }
            if (!dto.status) {
                dto.status = 'active';
            }
            return await this.repository.create(dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CREATE_FAILED', 'Failed to create customer', 500, error);
        }
    }
    async findAll(params = {}) {
        try {
            return await this.repository.findAll(params);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve customers', 500, error);
        }
    }
    async findById(id) {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve customer', 500, error);
        }
    }
    async update(id, dto) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            if (dto.contact?.primaryEmail && dto.contact.primaryEmail !== exists.contact?.primaryEmail) {
                const existingEmail = await this.repository.findByEmail(dto.contact.primaryEmail);
                if (existingEmail && existingEmail.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('Email already exists', {
                        email: dto.contact.primaryEmail
                    });
                }
            }
            if (dto.customerNumber && dto.customerNumber !== exists.customerNumber) {
                const existingCustomer = await this.repository.findByCustomerNumber(dto.customerNumber);
                if (existingCustomer && existingCustomer.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('Customer number already exists', {
                        customerNumber: dto.customerNumber
                    });
                }
            }
            if (dto.financial?.creditLimit !== undefined) {
                if (dto.financial.creditLimit < 0) {
                    throw new validation_exception_1.FastCrudValidationException('Credit limit cannot be negative');
                }
                console.log(`[FAST-CRUD] Credit limit updated for customer ${id}: ${exists.financial?.creditLimit} -> ${dto.financial.creditLimit}`);
            }
            if (dto.status && dto.status !== exists.status) {
                const validStatusTransitions = await this.validateStatusTransition(exists.status, dto.status);
                if (!validStatusTransitions) {
                    throw new validation_exception_1.FastCrudValidationException(`Invalid status transition from ${exists.status} to ${dto.status}`);
                }
            }
            return await this.repository.update(id, dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_FAILED', 'Failed to update customer', 500, error);
        }
    }
    async softDelete(id) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            if (exists.financial?.outstandingBalance && exists.financial.outstandingBalance > 0) {
                throw new validation_exception_1.FastCrudValidationException('Cannot delete customer with outstanding balance', {
                    outstandingBalance: exists.financial.outstandingBalance
                });
            }
            const hasActiveBusinesses = await this.checkActiveBusinesses(id);
            if (hasActiveBusinesses) {
                throw new validation_exception_1.FastCrudValidationException('Cannot delete customer with active orders or appointments');
            }
            await this.repository.softDelete(id);
            console.log(`[FAST-CRUD] Customer ${id} soft deleted`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('DELETE_FAILED', 'Failed to delete customer', 500, error);
        }
    }
    async findByCustomerNumber(customerNumber) {
        try {
            const result = await this.repository.findByCustomerNumber(customerNumber);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with number ${customerNumber} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_BY_NUMBER_FAILED', 'Failed to find customer by number', 500, error);
        }
    }
    async findByEmail(email) {
        try {
            const result = await this.repository.findByEmail(email);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with email ${email} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_BY_EMAIL_FAILED', 'Failed to find customer by email', 500, error);
        }
    }
    async searchCustomers(query) {
        try {
            if (!query || query.trim().length < 2) {
                throw new validation_exception_1.FastCrudValidationException('Search query must be at least 2 characters long');
            }
            return await this.repository.searchCustomers(query);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SEARCH_FAILED', 'Failed to search customers', 500, error);
        }
    }
    async updateStatus(id, status, reason) {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'blocked', 'vip', 'prospect', 'lead'];
            if (!validStatuses.includes(status)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid customer status', { validStatuses });
            }
            const validTransition = await this.validateStatusTransition(customer.status, status);
            if (!validTransition) {
                throw new validation_exception_1.FastCrudValidationException(`Invalid status transition from ${customer.status} to ${status}`);
            }
            await this.repository.updateStatus(id, status, reason);
            console.log(`[FAST-CRUD] Customer ${id} status updated to ${status}. Reason: ${reason || 'Not specified'}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_STATUS_FAILED', 'Failed to update customer status', 500, error);
        }
    }
    async activateCustomer(id) {
        try {
            await this.updateStatus(id, 'active', 'Customer activated');
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('ACTIVATE_FAILED', 'Failed to activate customer', 500, error);
        }
    }
    async suspendCustomer(id, reason) {
        try {
            if (!reason || reason.trim().length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Reason is required for customer suspension');
            }
            await this.updateStatus(id, 'suspended', reason);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SUSPEND_FAILED', 'Failed to suspend customer', 500, error);
        }
    }
    async updateCreditLimit(id, newLimit) {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            if (newLimit < 0) {
                throw new validation_exception_1.FastCrudValidationException('Credit limit cannot be negative');
            }
            if (customer.financial?.outstandingBalance && newLimit < customer.financial.outstandingBalance) {
                throw new validation_exception_1.FastCrudValidationException('Credit limit cannot be lower than outstanding balance', {
                    outstandingBalance: customer.financial.outstandingBalance,
                    proposedLimit: newLimit
                });
            }
            await this.repository.updateCreditLimit(id, newLimit);
            console.log(`[FAST-CRUD] Credit limit updated for customer ${id}: ${customer.financial?.creditLimit || 0} -> ${newLimit}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_CREDIT_LIMIT_FAILED', 'Failed to update credit limit', 500, error);
        }
    }
    async recordPayment(id, amount, paymentMethod) {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            if (amount <= 0) {
                throw new validation_exception_1.FastCrudValidationException('Payment amount must be greater than 0');
            }
            const validPaymentMethods = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'online'];
            if (!validPaymentMethods.includes(paymentMethod)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid payment method', { validMethods: validPaymentMethods });
            }
            await this.repository.recordPayment(id, amount, paymentMethod);
            console.log(`[FAST-CRUD] Payment recorded for customer ${id}: $${amount} via ${paymentMethod}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('RECORD_PAYMENT_FAILED', 'Failed to record payment', 500, error);
        }
    }
    async updateLoyaltyPoints(id, points, operation) {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            if (points < 0 && operation !== 'subtract') {
                throw new validation_exception_1.FastCrudValidationException('Points value cannot be negative for add/set operations');
            }
            const currentPoints = customer.loyalty?.points || 0;
            if (operation === 'subtract' && points > currentPoints) {
                throw new validation_exception_1.FastCrudValidationException('Cannot subtract more points than customer has', {
                    currentPoints,
                    pointsToSubtract: points
                });
            }
            await this.repository.updateLoyaltyPoints(id, points, operation);
            console.log(`[FAST-CRUD] Loyalty points ${operation} for customer ${id}: ${points} points`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_POINTS_FAILED', 'Failed to update loyalty points', 500, error);
        }
    }
    async redeemPoints(id, points, rewardId) {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            const currentPoints = customer.loyalty?.points || 0;
            if (points > currentPoints) {
                throw new validation_exception_1.FastCrudValidationException('Insufficient points for redemption', {
                    currentPoints,
                    pointsRequired: points
                });
            }
            if (points <= 0) {
                throw new validation_exception_1.FastCrudValidationException('Points to redeem must be greater than 0');
            }
            await this.repository.redeemPoints(id, points, rewardId);
            console.log(`[FAST-CRUD] Points redeemed for customer ${id}: ${points} points for reward ${rewardId}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('REDEEM_POINTS_FAILED', 'Failed to redeem points', 500, error);
        }
    }
    async updateSegments(id, segments) {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new validation_exception_1.FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            if (!segments || segments.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('At least one segment must be provided');
            }
            const validSegments = ['high_value', 'frequent_buyer', 'price_sensitive', 'quality_focused', 'early_adopter', 'brand_loyal', 'occasional_buyer', 'churned', 'at_risk', 'growth_potential'];
            const invalidSegments = segments.filter(segment => !validSegments.includes(segment));
            if (invalidSegments.length > 0) {
                throw new validation_exception_1.FastCrudValidationException('Invalid segments provided', { invalidSegments, validSegments });
            }
            await this.repository.updateSegments(id, segments);
            console.log(`[FAST-CRUD] Segments updated for customer ${id}: ${segments.join(', ')}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_SEGMENTS_FAILED', 'Failed to update segments', 500, error);
        }
    }
    async advancedSearch(criteria) {
        try {
            if (criteria.page && criteria.page < 1) {
                throw new validation_exception_1.FastCrudValidationException('Page number must be greater than 0');
            }
            if (criteria.limit && (criteria.limit < 1 || criteria.limit > 100)) {
                throw new validation_exception_1.FastCrudValidationException('Limit must be between 1 and 100');
            }
            if (criteria.minRevenue && criteria.maxRevenue && criteria.minRevenue > criteria.maxRevenue) {
                throw new validation_exception_1.FastCrudValidationException('Minimum revenue cannot be greater than maximum revenue');
            }
            return await this.repository.advancedSearch(criteria);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('ADVANCED_SEARCH_FAILED', 'Failed to perform advanced search', 500, error);
        }
    }
    async getCustomerStats(startDate, endDate) {
        try {
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (start >= end) {
                    throw new validation_exception_1.FastCrudValidationException('End date must be after start date');
                }
            }
            return await this.repository.getCustomerStats(startDate, endDate);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_STATS_FAILED', 'Failed to get customer statistics', 500, error);
        }
    }
    async bulkUpdateStatus(customerIds, status) {
        try {
            if (!customerIds || customerIds.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Customer IDs array cannot be empty');
            }
            const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'blocked', 'vip'];
            if (!validStatuses.includes(status)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid status value', { validStatuses });
            }
            await this.repository.bulkUpdateStatus(customerIds, status);
            console.log(`[FAST-CRUD] Bulk status update: ${customerIds.length} customers to ${status}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('BULK_UPDATE_STATUS_FAILED', 'Failed to bulk update status', 500, error);
        }
    }
    async mergeCustomers(primaryId, duplicateIds) {
        try {
            const primaryCustomer = await this.repository.findById(primaryId);
            if (!primaryCustomer) {
                throw new validation_exception_1.FastCrudValidationException(`Primary customer with ID ${primaryId} not found`);
            }
            if (!duplicateIds || duplicateIds.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Duplicate customer IDs array cannot be empty');
            }
            for (const duplicateId of duplicateIds) {
                const duplicate = await this.repository.findById(duplicateId);
                if (!duplicate) {
                    throw new validation_exception_1.FastCrudValidationException(`Duplicate customer with ID ${duplicateId} not found`);
                }
            }
            await this.repository.mergeCustomers(primaryId, duplicateIds);
            console.log(`[FAST-CRUD] Customers merged: ${duplicateIds.length} duplicates merged into ${primaryId}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('MERGE_CUSTOMERS_FAILED', 'Failed to merge customers', 500, error);
        }
    }
    async generateCustomerNumber(customerType) {
        const prefix = customerType === 'business' ? 'B' : 'C';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }
    async validateStatusTransition(currentStatus, newStatus) {
        const validTransitions = {
            'prospect': ['lead', 'active', 'inactive'],
            'lead': ['active', 'inactive'],
            'active': ['inactive', 'suspended', 'vip', 'blocked'],
            'inactive': ['active', 'prospect'],
            'suspended': ['active', 'blocked'],
            'blocked': ['active'],
            'vip': ['active', 'inactive'],
            'pending': ['active', 'inactive', 'blocked']
        };
        const allowedTransitions = validTransitions[currentStatus] || [];
        return allowedTransitions.includes(newStatus);
    }
    async checkActiveBusinesses(customerId) {
        return false;
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(customers_repository_port_1.CUSTOMERS_REPOSITORY_PORT)),
    __metadata("design:paramtypes", [Object])
], CustomersService);
//# sourceMappingURL=customers.service.js.map