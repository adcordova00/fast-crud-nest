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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_port_1 = require("../../core/ports/products-repository.port");
const validation_exception_1 = require("../../core/exceptions/validation.exception");
const fast_crud_exception_1 = require("../../core/exceptions/fast-crud.exception");
let ProductsService = class ProductsService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(dto) {
        try {
            console.log('[FAST-CRUD] ProductsService.create called');
            if (dto.catalog?.sku) {
                const existingSku = await this.repository.findBySku(dto.catalog.sku);
                if (existingSku) {
                    throw new validation_exception_1.FastCrudValidationException('SKU already exists', { sku: dto.catalog.sku });
                }
            }
            if (dto.catalog?.barcode) {
                const existingBarcode = await this.repository.findByBarcode(dto.catalog.barcode);
                if (existingBarcode) {
                    throw new validation_exception_1.FastCrudValidationException('Barcode already exists', { barcode: dto.catalog.barcode });
                }
            }
            if (dto.seo?.slug) {
                const existingSlug = await this.repository.findBySlug(dto.seo.slug);
                if (existingSlug) {
                    throw new validation_exception_1.FastCrudValidationException('SEO slug already exists', { slug: dto.seo.slug });
                }
            }
            if (dto.pricing?.basePrice && dto.pricing?.salePrice) {
                if (dto.pricing.salePrice > dto.pricing.basePrice) {
                    throw new validation_exception_1.FastCrudValidationException('Sale price cannot be higher than base price');
                }
            }
            if (dto.inventory?.currentStock && dto.inventory?.reservedStock) {
                if (dto.inventory.reservedStock > dto.inventory.currentStock) {
                    throw new validation_exception_1.FastCrudValidationException('Reserved stock cannot exceed current stock');
                }
            }
            return await this.repository.create(dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('CREATE_FAILED', 'Failed to create product', 500, error);
        }
    }
    async findAll(params = {}) {
        try {
            return await this.repository.findAll(params);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve products', 500, error);
        }
    }
    async findById(id) {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve product', 500, error);
        }
    }
    async update(id, dto) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            if (dto.catalog?.sku) {
                const existingSku = await this.repository.findBySku(dto.catalog.sku);
                if (existingSku && existingSku.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('SKU already exists', { sku: dto.catalog.sku });
                }
            }
            if (dto.catalog?.barcode) {
                const existingBarcode = await this.repository.findByBarcode(dto.catalog.barcode);
                if (existingBarcode && existingBarcode.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('Barcode already exists', { barcode: dto.catalog.barcode });
                }
            }
            return await this.repository.update(id, dto);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_FAILED', 'Failed to update product', 500, error);
        }
    }
    async softDelete(id) {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            await this.repository.softDelete(id);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('DELETE_FAILED', 'Failed to delete product', 500, error);
        }
    }
    async findBySku(sku) {
        try {
            const result = await this.repository.findBySku(sku);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Product with SKU ${sku} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_BY_SKU_FAILED', 'Failed to find product by SKU', 500, error);
        }
    }
    async findByBarcode(barcode) {
        try {
            const result = await this.repository.findByBarcode(barcode);
            if (!result) {
                throw new validation_exception_1.FastCrudValidationException(`Product with barcode ${barcode} not found`);
            }
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_BY_BARCODE_FAILED', 'Failed to find product by barcode', 500, error);
        }
    }
    async findByCategory(category) {
        try {
            return await this.repository.findByCategory(category);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_BY_CATEGORY_FAILED', 'Failed to find products by category', 500, error);
        }
    }
    async findByBrand(brand) {
        try {
            return await this.repository.findByBrand(brand);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('FIND_BY_BRAND_FAILED', 'Failed to find products by brand', 500, error);
        }
    }
    async updateStock(id, quantity, operation) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            if (quantity < 0) {
                throw new validation_exception_1.FastCrudValidationException('Quantity cannot be negative');
            }
            if (operation === 'subtract' && product.inventory?.currentStock < quantity) {
                throw new validation_exception_1.FastCrudValidationException('Insufficient stock for operation');
            }
            await this.repository.updateStock(id, quantity, operation);
            console.log(`[FAST-CRUD] Stock updated for product ${id}: ${operation} ${quantity}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_STOCK_FAILED', 'Failed to update stock', 500, error);
        }
    }
    async reserveStock(id, quantity) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            const availableStock = (product.inventory?.currentStock || 0) - (product.inventory?.reservedStock || 0);
            if (availableStock < quantity) {
                return false;
            }
            return await this.repository.reserveStock(id, quantity);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('RESERVE_STOCK_FAILED', 'Failed to reserve stock', 500, error);
        }
    }
    async getLowStock(threshold = 10) {
        try {
            return await this.repository.getLowStock(threshold);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_LOW_STOCK_FAILED', 'Failed to get low stock products', 500, error);
        }
    }
    async updatePrice(id, newPrice, reason) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            if (newPrice < 0) {
                throw new validation_exception_1.FastCrudValidationException('Price cannot be negative');
            }
            await this.repository.updatePrice(id, newPrice, reason);
            console.log(`[FAST-CRUD] Price updated for product ${id}: ${newPrice}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_PRICE_FAILED', 'Failed to update price', 500, error);
        }
    }
    async applyDiscount(id, discount) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            if (discount.percentage && (discount.percentage < 0 || discount.percentage > 100)) {
                throw new validation_exception_1.FastCrudValidationException('Discount percentage must be between 0 and 100');
            }
            if (discount.amount && discount.amount < 0) {
                throw new validation_exception_1.FastCrudValidationException('Discount amount cannot be negative');
            }
            await this.repository.applyDiscount(id, discount);
            console.log(`[FAST-CRUD] Discount applied to product ${id}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('APPLY_DISCOUNT_FAILED', 'Failed to apply discount', 500, error);
        }
    }
    async searchProducts(query) {
        try {
            if (query.priceMin && query.priceMax && query.priceMin > query.priceMax) {
                throw new validation_exception_1.FastCrudValidationException('Minimum price cannot be higher than maximum price');
            }
            if (query.page && query.page < 1) {
                throw new validation_exception_1.FastCrudValidationException('Page number must be greater than 0');
            }
            if (query.limit && (query.limit < 1 || query.limit > 100)) {
                throw new validation_exception_1.FastCrudValidationException('Limit must be between 1 and 100');
            }
            return await this.repository.searchProducts(query);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('SEARCH_FAILED', 'Failed to search products', 500, error);
        }
    }
    async findVariants(productId) {
        try {
            const product = await this.repository.findById(productId);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${productId} not found`);
            }
            return await this.repository.findVariants(productId);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('FIND_VARIANTS_FAILED', 'Failed to find product variants', 500, error);
        }
    }
    async updateVariantStock(productId, variantId, quantity) {
        try {
            const product = await this.repository.findById(productId);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${productId} not found`);
            }
            if (quantity < 0) {
                throw new validation_exception_1.FastCrudValidationException('Quantity cannot be negative');
            }
            await this.repository.updateVariantStock(productId, variantId, quantity);
            console.log(`[FAST-CRUD] Variant stock updated: ${productId}/${variantId} = ${quantity}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_VARIANT_STOCK_FAILED', 'Failed to update variant stock', 500, error);
        }
    }
    async getProductStats() {
        try {
            return await this.repository.getProductStats();
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_STATS_FAILED', 'Failed to get product statistics', 500, error);
        }
    }
    async getPopularProducts(limit = 10) {
        try {
            return await this.repository.getPopularProducts(limit);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_POPULAR_FAILED', 'Failed to get popular products', 500, error);
        }
    }
    async getFeaturedProducts(limit = 10) {
        try {
            return await this.repository.getFeaturedProducts(limit);
        }
        catch (error) {
            throw new fast_crud_exception_1.FastCrudException('GET_FEATURED_FAILED', 'Failed to get featured products', 500, error);
        }
    }
    async bulkUpdateStatus(productIds, status) {
        try {
            if (!productIds || productIds.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Product IDs array cannot be empty');
            }
            const validStatuses = ['draft', 'active', 'inactive', 'discontinued', 'out_of_stock', 'coming_soon'];
            if (!validStatuses.includes(status)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid status value');
            }
            await this.repository.bulkUpdateStatus(productIds, status);
            console.log(`[FAST-CRUD] Bulk status update: ${productIds.length} products to ${status}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('BULK_UPDATE_STATUS_FAILED', 'Failed to bulk update status', 500, error);
        }
    }
    async bulkImport(data) {
        try {
            if (!data || data.length === 0) {
                throw new validation_exception_1.FastCrudValidationException('Import data cannot be empty');
            }
            const validation = await this.repository.validateImportData(data);
            if (!validation.valid) {
                throw new validation_exception_1.FastCrudValidationException('Import data validation failed', { errors: validation.errors });
            }
            const result = await this.repository.bulkImport(data);
            console.log(`[FAST-CRUD] Bulk import completed: ${result.success} success, ${result.failed} failed`);
            return result;
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('BULK_IMPORT_FAILED', 'Failed to bulk import products', 500, error);
        }
    }
    async updatePrimaryImage(id, imageUrl) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            await this.repository.updatePrimaryImage(id, imageUrl);
            console.log(`[FAST-CRUD] Primary image updated for product ${id}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_IMAGE_FAILED', 'Failed to update primary image', 500, error);
        }
    }
    async addMedia(id, media) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            const validTypes = ['image', 'video', 'document', 'audio', '3d_model'];
            if (!validTypes.includes(media.type)) {
                throw new validation_exception_1.FastCrudValidationException('Invalid media type');
            }
            await this.repository.addMedia(id, media);
            console.log(`[FAST-CRUD] Media added to product ${id}: ${media.type}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('ADD_MEDIA_FAILED', 'Failed to add media', 500, error);
        }
    }
    async updateSeoData(id, seoData) {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new validation_exception_1.FastCrudValidationException(`Product with ID ${id} not found`);
            }
            if (seoData.slug) {
                const existingSlug = await this.repository.findBySlug(seoData.slug);
                if (existingSlug && existingSlug.id !== id) {
                    throw new validation_exception_1.FastCrudValidationException('SEO slug already exists', { slug: seoData.slug });
                }
            }
            await this.repository.updateSeoData(id, seoData);
            console.log(`[FAST-CRUD] SEO data updated for product ${id}`);
        }
        catch (error) {
            throw error instanceof fast_crud_exception_1.FastCrudException ? error :
                new fast_crud_exception_1.FastCrudException('UPDATE_SEO_FAILED', 'Failed to update SEO data', 500, error);
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(products_repository_port_1.PRODUCTS_REPOSITORY_PORT)),
    __metadata("design:paramtypes", [Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map