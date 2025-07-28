import { Injectable, Inject } from '@nestjs/common';
import { CustomersRepositoryPort, CUSTOMERS_REPOSITORY_PORT } from '../../core/ports/customers-repository.port';
import { CreateCustomersDto } from './dto/create-customers.dto';
import { UpdateCustomersDto } from './dto/update-customers.dto';
import { FastCrudValidationException } from '../../core/exceptions/validation.exception';
import { FastCrudException } from '../../core/exceptions/fast-crud.exception';

@Injectable()
export class CustomersService {
    constructor(
        @Inject(CUSTOMERS_REPOSITORY_PORT)
        private readonly repository: CustomersRepositoryPort,
    ) { }

    /**
     * Creates a new customer with comprehensive validation
     */
    async create(dto: CreateCustomersDto): Promise<any> {
        try {
            console.log('[FAST-CRUD] CustomersService.create called');

            // Validate customer number uniqueness
            if (dto.customerNumber) {
                const existingCustomer = await this.repository.findByCustomerNumber(dto.customerNumber);
                if (existingCustomer) {
                    throw new FastCrudValidationException('Customer number already exists', { 
                        customerNumber: dto.customerNumber 
                    });
                }
            }

            // Validate email uniqueness
            if (dto.contact?.primaryEmail) {
                const existingEmail = await this.repository.findByEmail(dto.contact.primaryEmail);
                if (existingEmail) {
                    throw new FastCrudValidationException('Email already exists', { 
                        email: dto.contact.primaryEmail 
                    });
                }
            }

            // Validate business tax ID uniqueness for business customers
            if (dto.customerType === 'business' && dto.business?.taxId) {
                const existingTaxId = await this.repository.findByTaxId(dto.business.taxId);
                if (existingTaxId) {
                    throw new FastCrudValidationException('Tax ID already exists', { 
                        taxId: dto.business.taxId 
                    });
                }
            }

            // Validate required fields based on customer type
            if (dto.customerType === 'business') {
                if (!dto.business?.companyName) {
                    throw new FastCrudValidationException('Company name is required for business customers');
                }
            } else {
                if (!dto.personal?.firstName || !dto.personal?.lastName) {
                    throw new FastCrudValidationException('First name and last name are required for individual customers');
                }
            }

            // Validate communication preferences
            if (dto.contact?.allowMarketing === false && dto.preferences?.notifications?.marketing === true) {
                throw new FastCrudValidationException('Marketing notifications conflict with communication preferences');
            }

            // Validate credit limit for financial information
            if (dto.financial?.creditLimit && dto.financial?.creditLimit < 0) {
                throw new FastCrudValidationException('Credit limit cannot be negative');
            }

            // Generate customer number if not provided
            if (!dto.customerNumber) {
                dto.customerNumber = await this.generateCustomerNumber(dto.customerType);
            }

            // Set default status if not provided
            if (!dto.status) {
                dto.status = 'active' as any; // Will be mapped to enum by repository
            }

            return await this.repository.create(dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CREATE_FAILED', 'Failed to create customer', 500, error);
        }
    }

    /**
     * Standard CRUD operations
     */
    async findAll(params: any = {}): Promise<any[]> {
        try {
            return await this.repository.findAll(params);
        } catch (error) {
            throw new FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve customers', 500, error);
        }
    }

    async findById(id: string): Promise<any> {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve customer', 500, error);
        }
    }

    async update(id: string, dto: UpdateCustomersDto): Promise<any> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            // Validate email uniqueness if being updated
            if (dto.contact?.primaryEmail && dto.contact.primaryEmail !== exists.contact?.primaryEmail) {
                const existingEmail = await this.repository.findByEmail(dto.contact.primaryEmail);
                if (existingEmail && existingEmail.id !== id) {
                    throw new FastCrudValidationException('Email already exists', { 
                        email: dto.contact.primaryEmail 
                    });
                }
            }

            // Validate customer number uniqueness if being updated
            if (dto.customerNumber && dto.customerNumber !== exists.customerNumber) {
                const existingCustomer = await this.repository.findByCustomerNumber(dto.customerNumber);
                if (existingCustomer && existingCustomer.id !== id) {
                    throw new FastCrudValidationException('Customer number already exists', { 
                        customerNumber: dto.customerNumber 
                    });
                }
            }

            // Validate credit limit changes
            if (dto.financial?.creditLimit !== undefined) {
                if (dto.financial.creditLimit < 0) {
                    throw new FastCrudValidationException('Credit limit cannot be negative');
                }

                // Log credit limit changes for audit
                console.log(`[FAST-CRUD] Credit limit updated for customer ${id}: ${exists.financial?.creditLimit} -> ${dto.financial.creditLimit}`);
            }

            // Validate status changes
            if (dto.status && dto.status !== exists.status) {
                const validStatusTransitions = await this.validateStatusTransition(exists.status, dto.status);
                if (!validStatusTransitions) {
                    throw new FastCrudValidationException(`Invalid status transition from ${exists.status} to ${dto.status}`);
                }
            }

            return await this.repository.update(id, dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_FAILED', 'Failed to update customer', 500, error);
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            // Check if customer has outstanding balance
            if (exists.financial?.outstandingBalance && exists.financial.outstandingBalance > 0) {
                throw new FastCrudValidationException('Cannot delete customer with outstanding balance', {
                    outstandingBalance: exists.financial.outstandingBalance
                });
            }

            // Check if customer has active orders or appointments
            const hasActiveBusinesses = await this.checkActiveBusinesses(id);
            if (hasActiveBusinesses) {
                throw new FastCrudValidationException('Cannot delete customer with active orders or appointments');
            }

            await this.repository.softDelete(id);
            console.log(`[FAST-CRUD] Customer ${id} soft deleted`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('DELETE_FAILED', 'Failed to delete customer', 500, error);
        }
    }

    /**
     * Customer identification and search methods
     */
    async findByCustomerNumber(customerNumber: string): Promise<any> {
        try {
            const result = await this.repository.findByCustomerNumber(customerNumber);
            if (!result) {
                throw new FastCrudValidationException(`Customer with number ${customerNumber} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_BY_NUMBER_FAILED', 'Failed to find customer by number', 500, error);
        }
    }

    async findByEmail(email: string): Promise<any> {
        try {
            const result = await this.repository.findByEmail(email);
            if (!result) {
                throw new FastCrudValidationException(`Customer with email ${email} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_BY_EMAIL_FAILED', 'Failed to find customer by email', 500, error);
        }
    }

    async searchCustomers(query: string): Promise<any[]> {
        try {
            if (!query || query.trim().length < 2) {
                throw new FastCrudValidationException('Search query must be at least 2 characters long');
            }
            return await this.repository.searchCustomers(query);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SEARCH_FAILED', 'Failed to search customers', 500, error);
        }
    }

    /**
     * Customer status and lifecycle management
     */
    async updateStatus(id: string, status: string, reason?: string): Promise<void> {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'blocked', 'vip', 'prospect', 'lead'];
            if (!validStatuses.includes(status)) {
                throw new FastCrudValidationException('Invalid customer status', { validStatuses });
            }

            const validTransition = await this.validateStatusTransition(customer.status, status);
            if (!validTransition) {
                throw new FastCrudValidationException(`Invalid status transition from ${customer.status} to ${status}`);
            }

            await this.repository.updateStatus(id, status, reason);
            console.log(`[FAST-CRUD] Customer ${id} status updated to ${status}. Reason: ${reason || 'Not specified'}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_STATUS_FAILED', 'Failed to update customer status', 500, error);
        }
    }

    async activateCustomer(id: string): Promise<void> {
        try {
            await this.updateStatus(id, 'active' as any, 'Customer activated');
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('ACTIVATE_FAILED', 'Failed to activate customer', 500, error);
        }
    }

    async suspendCustomer(id: string, reason: string): Promise<void> {
        try {
            if (!reason || reason.trim().length === 0) {
                throw new FastCrudValidationException('Reason is required for customer suspension');
            }
            await this.updateStatus(id, 'suspended' as any, reason);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SUSPEND_FAILED', 'Failed to suspend customer', 500, error);
        }
    }

    /**
     * Financial operations
     */
    async updateCreditLimit(id: string, newLimit: number): Promise<void> {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            if (newLimit < 0) {
                throw new FastCrudValidationException('Credit limit cannot be negative');
            }

            // Check if new limit is below outstanding balance
            if (customer.financial?.outstandingBalance && newLimit < customer.financial.outstandingBalance) {
                throw new FastCrudValidationException('Credit limit cannot be lower than outstanding balance', {
                    outstandingBalance: customer.financial.outstandingBalance,
                    proposedLimit: newLimit
                });
            }

            await this.repository.updateCreditLimit(id, newLimit);
            console.log(`[FAST-CRUD] Credit limit updated for customer ${id}: ${customer.financial?.creditLimit || 0} -> ${newLimit}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_CREDIT_LIMIT_FAILED', 'Failed to update credit limit', 500, error);
        }
    }

    async recordPayment(id: string, amount: number, paymentMethod: string): Promise<void> {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            if (amount <= 0) {
                throw new FastCrudValidationException('Payment amount must be greater than 0');
            }

            const validPaymentMethods = ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'check', 'online'];
            if (!validPaymentMethods.includes(paymentMethod)) {
                throw new FastCrudValidationException('Invalid payment method', { validMethods: validPaymentMethods });
            }

            await this.repository.recordPayment(id, amount, paymentMethod);
            console.log(`[FAST-CRUD] Payment recorded for customer ${id}: $${amount} via ${paymentMethod}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('RECORD_PAYMENT_FAILED', 'Failed to record payment', 500, error);
        }
    }

    /**
     * Loyalty and rewards management
     */
    async updateLoyaltyPoints(id: string, points: number, operation: 'add' | 'subtract' | 'set'): Promise<void> {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            if (points < 0 && operation !== 'subtract') {
                throw new FastCrudValidationException('Points value cannot be negative for add/set operations');
            }

            const currentPoints = customer.loyalty?.points || 0;
            
            if (operation === 'subtract' && points > currentPoints) {
                throw new FastCrudValidationException('Cannot subtract more points than customer has', {
                    currentPoints,
                    pointsToSubtract: points
                });
            }

            await this.repository.updateLoyaltyPoints(id, points, operation);
            console.log(`[FAST-CRUD] Loyalty points ${operation} for customer ${id}: ${points} points`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_POINTS_FAILED', 'Failed to update loyalty points', 500, error);
        }
    }

    async redeemPoints(id: string, points: number, rewardId: string): Promise<void> {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            const currentPoints = customer.loyalty?.points || 0;
            if (points > currentPoints) {
                throw new FastCrudValidationException('Insufficient points for redemption', {
                    currentPoints,
                    pointsRequired: points
                });
            }

            if (points <= 0) {
                throw new FastCrudValidationException('Points to redeem must be greater than 0');
            }

            await this.repository.redeemPoints(id, points, rewardId);
            console.log(`[FAST-CRUD] Points redeemed for customer ${id}: ${points} points for reward ${rewardId}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('REDEEM_POINTS_FAILED', 'Failed to redeem points', 500, error);
        }
    }

    /**
     * Segmentation and analytics
     */
    async updateSegments(id: string, segments: string[]): Promise<void> {
        try {
            const customer = await this.repository.findById(id);
            if (!customer) {
                throw new FastCrudValidationException(`Customer with ID ${id} not found`);
            }

            if (!segments || segments.length === 0) {
                throw new FastCrudValidationException('At least one segment must be provided');
            }

            const validSegments = ['high_value', 'frequent_buyer', 'price_sensitive', 'quality_focused', 'early_adopter', 'brand_loyal', 'occasional_buyer', 'churned', 'at_risk', 'growth_potential'];
            const invalidSegments = segments.filter(segment => !validSegments.includes(segment));
            if (invalidSegments.length > 0) {
                throw new FastCrudValidationException('Invalid segments provided', { invalidSegments, validSegments });
            }

            await this.repository.updateSegments(id, segments);
            console.log(`[FAST-CRUD] Segments updated for customer ${id}: ${segments.join(', ')}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_SEGMENTS_FAILED', 'Failed to update segments', 500, error);
        }
    }

    /**
     * Advanced search and analytics
     */
    async advancedSearch(criteria: any): Promise<any> {
        try {
            // Validate search criteria
            if (criteria.page && criteria.page < 1) {
                throw new FastCrudValidationException('Page number must be greater than 0');
            }

            if (criteria.limit && (criteria.limit < 1 || criteria.limit > 100)) {
                throw new FastCrudValidationException('Limit must be between 1 and 100');
            }

            if (criteria.minRevenue && criteria.maxRevenue && criteria.minRevenue > criteria.maxRevenue) {
                throw new FastCrudValidationException('Minimum revenue cannot be greater than maximum revenue');
            }

            return await this.repository.advancedSearch(criteria);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('ADVANCED_SEARCH_FAILED', 'Failed to perform advanced search', 500, error);
        }
    }

    async getCustomerStats(startDate?: string, endDate?: string): Promise<any> {
        try {
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (start >= end) {
                    throw new FastCrudValidationException('End date must be after start date');
                }
            }

            return await this.repository.getCustomerStats(startDate, endDate);
        } catch (error) {
            throw new FastCrudException('GET_STATS_FAILED', 'Failed to get customer statistics', 500, error);
        }
    }

    /**
     * Bulk operations
     */
    async bulkUpdateStatus(customerIds: string[], status: string): Promise<void> {
        try {
            if (!customerIds || customerIds.length === 0) {
                throw new FastCrudValidationException('Customer IDs array cannot be empty');
            }

            const validStatuses = ['active', 'inactive', 'pending', 'suspended', 'blocked', 'vip'];
            if (!validStatuses.includes(status)) {
                throw new FastCrudValidationException('Invalid status value', { validStatuses });
            }

            await this.repository.bulkUpdateStatus(customerIds, status);
            console.log(`[FAST-CRUD] Bulk status update: ${customerIds.length} customers to ${status}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('BULK_UPDATE_STATUS_FAILED', 'Failed to bulk update status', 500, error);
        }
    }

    /**
     * Data management and compliance
     */
    async mergeCustomers(primaryId: string, duplicateIds: string[]): Promise<void> {
        try {
            const primaryCustomer = await this.repository.findById(primaryId);
            if (!primaryCustomer) {
                throw new FastCrudValidationException(`Primary customer with ID ${primaryId} not found`);
            }

            if (!duplicateIds || duplicateIds.length === 0) {
                throw new FastCrudValidationException('Duplicate customer IDs array cannot be empty');
            }

            // Validate all duplicate customers exist
            for (const duplicateId of duplicateIds) {
                const duplicate = await this.repository.findById(duplicateId);
                if (!duplicate) {
                    throw new FastCrudValidationException(`Duplicate customer with ID ${duplicateId} not found`);
                }
            }

            await this.repository.mergeCustomers(primaryId, duplicateIds);
            console.log(`[FAST-CRUD] Customers merged: ${duplicateIds.length} duplicates merged into ${primaryId}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('MERGE_CUSTOMERS_FAILED', 'Failed to merge customers', 500, error);
        }
    }

    /**
     * Private helper methods
     */
    private async generateCustomerNumber(customerType: string): Promise<string> {
        const prefix = customerType === 'business' ? 'B' : 'C';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}${timestamp}${random}`;
    }

    private async validateStatusTransition(currentStatus: string, newStatus: string): Promise<boolean> {
        // Define valid status transitions
        const validTransitions: Record<string, string[]> = {
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

    private async checkActiveBusinesses(customerId: string): Promise<boolean> {
        // This would integrate with Orders and Appointments modules
        // For now, return false to allow deletion
        // In real implementation, check for active orders, appointments, etc.
        return false;
    }
} 