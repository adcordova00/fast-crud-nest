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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_products_dto_1 = require("./dto/create-products.dto");
const update_products_dto_1 = require("./dto/update-products.dto");
class UpdateStockDto {
}
class ReserveStockDto {
}
class UpdatePriceDto {
}
class ApplyDiscountDto {
}
class AddMediaDto {
}
class BulkUpdateStatusDto {
}
class BulkImportDto {
}
class SearchProductsDto {
}
let ProductsController = class ProductsController {
    constructor(service) {
        this.service = service;
    }
    async create(dto) {
        return await this.service.create(dto);
    }
    async findAll(page = 1, limit = 10, search, category, brand, status, featured) {
        const params = {
            page: +page,
            limit: +limit,
            search,
            category,
            brand,
            status,
            featured
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
    async searchProducts(query) {
        return await this.service.searchProducts(query);
    }
    async findBySku(sku) {
        return await this.service.findBySku(sku);
    }
    async findByBarcode(barcode) {
        return await this.service.findByBarcode(barcode);
    }
    async findByCategory(category) {
        return await this.service.findByCategory(category);
    }
    async findByBrand(brand) {
        return await this.service.findByBrand(brand);
    }
    async updateStock(id, stockData) {
        await this.service.updateStock(id, stockData.quantity, stockData.operation);
    }
    async reserveStock(id, reserveData) {
        const success = await this.service.reserveStock(id, reserveData.quantity);
        return { success, reserved: success ? reserveData.quantity : 0 };
    }
    async getLowStock(threshold = 10) {
        return await this.service.getLowStock(+threshold);
    }
    async updatePrice(id, priceData) {
        await this.service.updatePrice(id, priceData.newPrice, priceData.reason);
    }
    async applyDiscount(id, discountData) {
        await this.service.applyDiscount(id, discountData);
    }
    async findVariants(productId) {
        return await this.service.findVariants(productId);
    }
    async updateVariantStock(productId, variantId, stockData) {
        await this.service.updateVariantStock(productId, variantId, stockData.quantity);
    }
    async updatePrimaryImage(id, imageData) {
        await this.service.updatePrimaryImage(id, imageData.imageUrl);
    }
    async addMedia(id, mediaData) {
        await this.service.addMedia(id, mediaData);
        return { message: 'Media added successfully' };
    }
    async updateSeoData(id, seoData) {
        await this.service.updateSeoData(id, seoData);
    }
    async getProductStats() {
        return await this.service.getProductStats();
    }
    async getPopularProducts(limit = 10) {
        return await this.service.getPopularProducts(+limit);
    }
    async getFeaturedProducts(limit = 10) {
        return await this.service.getFeaturedProducts(+limit);
    }
    async bulkUpdateStatus(bulkData) {
        await this.service.bulkUpdateStatus(bulkData.productIds, bulkData.status);
    }
    async bulkImport(importData) {
        return await this.service.bulkImport(importData.products);
    }
    async getCategories() {
        return { message: 'Categories endpoint - implement based on your category system' };
    }
    async getBrands() {
        return { message: 'Brands endpoint - implement based on your brand system' };
    }
    async getCollections() {
        return { message: 'Collections endpoint - implement based on your collection system' };
    }
    async getRelatedProducts(id) {
        return { message: 'Related products endpoint - implement recommendation logic' };
    }
    async getCrossSellProducts(id) {
        return { message: 'Cross-sell products endpoint - implement recommendation logic' };
    }
    async getUpSellProducts(id) {
        return { message: 'Up-sell products endpoint - implement recommendation logic' };
    }
    async getProductReviews(id, page = 1, limit = 10) {
        return {
            message: 'Product reviews endpoint - integrate with reviews module',
            productId: id,
            page: +page,
            limit: +limit
        };
    }
    async getReviewsSummary(id) {
        return {
            message: 'Reviews summary endpoint - integrate with reviews module',
            productId: id
        };
    }
    async checkAvailability(id) {
        const product = await this.service.findById(id);
        return {
            productId: id,
            available: product.inventory?.availableStock > 0,
            stock: product.inventory?.availableStock || 0,
            status: product.catalog?.status,
            stockStatus: product.inventory?.stockStatus
        };
    }
    async checkQuantityAvailability(id, quantity) {
        const product = await this.service.findById(id);
        const availableStock = product.inventory?.availableStock || 0;
        return {
            productId: id,
            requestedQuantity: +quantity,
            available: availableStock >= +quantity,
            availableStock,
            canFulfill: availableStock >= +quantity
        };
    }
    async exportToCsv(filters) {
        return {
            message: 'CSV export endpoint - implement export functionality',
            filters
        };
    }
    async exportToExcel(filters) {
        return {
            message: 'Excel export endpoint - implement export functionality',
            filters
        };
    }
    async duplicateProduct(id) {
        const originalProduct = await this.service.findById(id);
        const duplicateData = {
            ...originalProduct,
            catalog: {
                ...originalProduct.catalog,
                name: `${originalProduct.catalog?.name} (Copy)`,
                sku: `${originalProduct.catalog?.sku}-copy-${Date.now()}`,
                status: 'draft'
            }
        };
        delete duplicateData.id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;
        return await this.service.create(duplicateData);
    }
    async findProductsWithMissingImages() {
        return { message: 'Missing images health check - implement based on media validation' };
    }
    async findProductsWithMissingDescriptions() {
        return { message: 'Missing descriptions health check - implement validation' };
    }
    async findProductsWithInvalidPricing() {
        return { message: 'Invalid pricing health check - implement validation' };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_products_dto_1.CreateProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('brand')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('featured')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_products_dto_1.UpdateProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Get)('search/advanced'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SearchProductsDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('sku/:sku'),
    __param(0, (0, common_1.Param)('sku')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findBySku", null);
__decorate([
    (0, common_1.Get)('barcode/:barcode'),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByBarcode", null);
__decorate([
    (0, common_1.Get)('category/:category'),
    __param(0, (0, common_1.Param)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)('brand/:brand'),
    __param(0, (0, common_1.Param)('brand')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findByBrand", null);
__decorate([
    (0, common_1.Put)(':id/stock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateStockDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Post)(':id/stock/reserve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ReserveStockDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "reserveStock", null);
__decorate([
    (0, common_1.Get)('inventory/low-stock'),
    __param(0, (0, common_1.Query)('threshold')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getLowStock", null);
__decorate([
    (0, common_1.Put)(':id/price'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdatePriceDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updatePrice", null);
__decorate([
    (0, common_1.Post)(':id/discount'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ApplyDiscountDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "applyDiscount", null);
__decorate([
    (0, common_1.Get)(':id/variants'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findVariants", null);
__decorate([
    (0, common_1.Put)(':productId/variants/:variantId/stock'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('variantId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateVariantStock", null);
__decorate([
    (0, common_1.Put)(':id/media/primary-image'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updatePrimaryImage", null);
__decorate([
    (0, common_1.Post)(':id/media'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddMediaDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addMedia", null);
__decorate([
    (0, common_1.Put)(':id/seo'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateSeoData", null);
__decorate([
    (0, common_1.Get)('analytics/stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductStats", null);
__decorate([
    (0, common_1.Get)('analytics/popular'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getPopularProducts", null);
__decorate([
    (0, common_1.Get)('analytics/featured'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getFeaturedProducts", null);
__decorate([
    (0, common_1.Put)('bulk/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkUpdateStatusDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Post)('bulk/import'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BulkImportDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bulkImport", null);
__decorate([
    (0, common_1.Get)('catalog/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('catalog/brands'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getBrands", null);
__decorate([
    (0, common_1.Get)('catalog/collections'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCollections", null);
__decorate([
    (0, common_1.Get)(':id/recommendations/related'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getRelatedProducts", null);
__decorate([
    (0, common_1.Get)(':id/recommendations/cross-sell'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCrossSellProducts", null);
__decorate([
    (0, common_1.Get)(':id/recommendations/up-sell'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getUpSellProducts", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getProductReviews", null);
__decorate([
    (0, common_1.Get)(':id/reviews/summary'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getReviewsSummary", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "checkAvailability", null);
__decorate([
    (0, common_1.Get)(':id/availability/:quantity'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "checkQuantityAvailability", null);
__decorate([
    (0, common_1.Get)('export/csv'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "exportToCsv", null);
__decorate([
    (0, common_1.Get)('export/excel'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "exportToExcel", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "duplicateProduct", null);
__decorate([
    (0, common_1.Get)('health/missing-images'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findProductsWithMissingImages", null);
__decorate([
    (0, common_1.Get)('health/missing-descriptions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findProductsWithMissingDescriptions", null);
__decorate([
    (0, common_1.Get)('health/invalid-pricing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findProductsWithInvalidPricing", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map