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
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';

// DTOs for specific product endpoints
class UpdateStockDto {
    quantity!: number;
    operation!: 'add' | 'subtract' | 'set';
    reason?: string;
}

class ReserveStockDto {
    quantity!: number;
}

class UpdatePriceDto {
    newPrice!: number;
    reason?: string;
}

class ApplyDiscountDto {
    percentage?: number;
    amount?: number;
    startDate?: string;
    endDate?: string;
    minQuantity?: number;
    maxQuantity?: number;
}

class AddMediaDto {
    url!: string;
    type!: string;
    alt?: string;
}

class BulkUpdateStatusDto {
    productIds!: string[];
    status!: string;
}

class BulkImportDto {
    products!: CreateProductsDto[];
}

class SearchProductsDto {
    text?: string;
    category?: string;
    brand?: string;
    priceMin?: number;
    priceMax?: number;
    status?: string;
    inStock?: boolean;
    featured?: boolean;
    tags?: string[];
    sortBy?: 'name' | 'price' | 'created' | 'popularity';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) { }

    /**
     * Standard CRUD Operations
     */
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateProductsDto) {
        return await this.service.create(dto);
    }

    @Get()
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('brand') brand?: string,
        @Query('status') status?: string,
        @Query('featured') featured?: boolean
    ) {
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

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProductsDto
    ) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async softDelete(@Param('id') id: string) {
        await this.service.softDelete(id);
    }

    /**
     * Product Search Endpoints
     */
    @Get('search/advanced')
    async searchProducts(@Query() query: SearchProductsDto) {
        return await this.service.searchProducts(query);
    }

    @Get('sku/:sku')
    async findBySku(@Param('sku') sku: string) {
        return await this.service.findBySku(sku);
    }

    @Get('barcode/:barcode')
    async findByBarcode(@Param('barcode') barcode: string) {
        return await this.service.findByBarcode(barcode);
    }

    @Get('category/:category')
    async findByCategory(@Param('category') category: string) {
        return await this.service.findByCategory(category);
    }

    @Get('brand/:brand')
    async findByBrand(@Param('brand') brand: string) {
        return await this.service.findByBrand(brand);
    }

    /**
     * Inventory Management Endpoints
     */
    @Put(':id/stock')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateStock(
        @Param('id') id: string,
        @Body() stockData: UpdateStockDto
    ) {
        await this.service.updateStock(id, stockData.quantity, stockData.operation);
    }

    @Post(':id/stock/reserve')
    async reserveStock(
        @Param('id') id: string,
        @Body() reserveData: ReserveStockDto
    ) {
        const success = await this.service.reserveStock(id, reserveData.quantity);
        return { success, reserved: success ? reserveData.quantity : 0 };
    }

    @Get('inventory/low-stock')
    async getLowStock(@Query('threshold') threshold = 10) {
        return await this.service.getLowStock(+threshold);
    }

    /**
     * Pricing Management Endpoints
     */
    @Put(':id/price')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePrice(
        @Param('id') id: string,
        @Body() priceData: UpdatePriceDto
    ) {
        await this.service.updatePrice(id, priceData.newPrice, priceData.reason);
    }

    @Post(':id/discount')
    @HttpCode(HttpStatus.NO_CONTENT)
    async applyDiscount(
        @Param('id') id: string,
        @Body() discountData: ApplyDiscountDto
    ) {
        await this.service.applyDiscount(id, discountData);
    }

    /**
     * Variant Management Endpoints
     */
    @Get(':id/variants')
    async findVariants(@Param('id') productId: string) {
        return await this.service.findVariants(productId);
    }

    @Put(':productId/variants/:variantId/stock')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateVariantStock(
        @Param('productId') productId: string,
        @Param('variantId') variantId: string,
        @Body() stockData: { quantity: number }
    ) {
        await this.service.updateVariantStock(productId, variantId, stockData.quantity);
    }

    /**
     * Media Management Endpoints
     */
    @Put(':id/media/primary-image')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePrimaryImage(
        @Param('id') id: string,
        @Body() imageData: { imageUrl: string }
    ) {
        await this.service.updatePrimaryImage(id, imageData.imageUrl);
    }

    @Post(':id/media')
    @HttpCode(HttpStatus.CREATED)
    async addMedia(
        @Param('id') id: string,
        @Body() mediaData: AddMediaDto
    ) {
        await this.service.addMedia(id, mediaData);
        return { message: 'Media added successfully' };
    }

    /**
     * SEO Management Endpoints
     */
    @Put(':id/seo')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateSeoData(
        @Param('id') id: string,
        @Body() seoData: any
    ) {
        await this.service.updateSeoData(id, seoData);
    }

    /**
     * Analytics and Reporting Endpoints
     */
    @Get('analytics/stats')
    async getProductStats() {
        return await this.service.getProductStats();
    }

    @Get('analytics/popular')
    async getPopularProducts(@Query('limit') limit = 10) {
        return await this.service.getPopularProducts(+limit);
    }

    @Get('analytics/featured')
    async getFeaturedProducts(@Query('limit') limit = 10) {
        return await this.service.getFeaturedProducts(+limit);
    }

    /**
     * Bulk Operations Endpoints
     */
    @Put('bulk/status')
    @HttpCode(HttpStatus.NO_CONTENT)
    async bulkUpdateStatus(@Body() bulkData: BulkUpdateStatusDto) {
        await this.service.bulkUpdateStatus(bulkData.productIds, bulkData.status);
    }

    @Post('bulk/import')
    async bulkImport(@Body() importData: BulkImportDto) {
        return await this.service.bulkImport(importData.products);
    }

    /**
     * Product Catalog Management Endpoints
     */
    @Get('catalog/categories')
    async getCategories() {
        // This would typically return a list of all categories
        // Implementation would depend on your category management system
        return { message: 'Categories endpoint - implement based on your category system' };
    }

    @Get('catalog/brands')
    async getBrands() {
        // This would typically return a list of all brands
        return { message: 'Brands endpoint - implement based on your brand system' };
    }

    @Get('catalog/collections')
    async getCollections() {
        // This would return product collections
        return { message: 'Collections endpoint - implement based on your collection system' };
    }

    /**
     * Product Recommendations Endpoints
     */
    @Get(':id/recommendations/related')
    async getRelatedProducts(@Param('id') id: string) {
        // Implementation would depend on your recommendation engine
        return { message: 'Related products endpoint - implement recommendation logic' };
    }

    @Get(':id/recommendations/cross-sell')
    async getCrossSellProducts(@Param('id') id: string) {
        return { message: 'Cross-sell products endpoint - implement recommendation logic' };
    }

    @Get(':id/recommendations/up-sell')
    async getUpSellProducts(@Param('id') id: string) {
        return { message: 'Up-sell products endpoint - implement recommendation logic' };
    }

    /**
     * Product Review Integration Endpoints
     */
    @Get(':id/reviews')
    async getProductReviews(
        @Param('id') id: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ) {
        // Integration with reviews module (when implemented)
        return { 
            message: 'Product reviews endpoint - integrate with reviews module',
            productId: id,
            page: +page,
            limit: +limit
        };
    }

    @Get(':id/reviews/summary')
    async getReviewsSummary(@Param('id') id: string) {
        // Reviews summary with ratings, count, etc.
        return { 
            message: 'Reviews summary endpoint - integrate with reviews module',
            productId: id
        };
    }

    /**
     * Product Availability Endpoints
     */
    @Get(':id/availability')
    async checkAvailability(@Param('id') id: string) {
        const product = await this.service.findById(id);
        return {
            productId: id,
            available: product.inventory?.availableStock > 0,
            stock: product.inventory?.availableStock || 0,
            status: product.catalog?.status,
            stockStatus: product.inventory?.stockStatus
        };
    }

    @Get(':id/availability/:quantity')
    async checkQuantityAvailability(
        @Param('id') id: string,
        @Param('quantity') quantity: number
    ) {
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

    /**
     * Product Export Endpoints
     */
    @Get('export/csv')
    async exportToCsv(@Query() filters: any) {
        // Export products to CSV format
        return { 
            message: 'CSV export endpoint - implement export functionality',
            filters
        };
    }

    @Get('export/excel')
    async exportToExcel(@Query() filters: any) {
        // Export products to Excel format
        return { 
            message: 'Excel export endpoint - implement export functionality',
            filters
        };
    }

    /**
     * Product Duplication and Templates
     */
    @Post(':id/duplicate')
    async duplicateProduct(@Param('id') id: string) {
        const originalProduct = await this.service.findById(id);
        
        // Create a copy with modified SKU and name
        const duplicateData = {
            ...originalProduct,
            catalog: {
                ...originalProduct.catalog,
                name: `${originalProduct.catalog?.name} (Copy)`,
                sku: `${originalProduct.catalog?.sku}-copy-${Date.now()}`,
                status: 'draft'
            }
        };

        // Remove ID and audit fields
        delete duplicateData.id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;

        return await this.service.create(duplicateData);
    }

    /**
     * Product Health Check Endpoints
     */
    @Get('health/missing-images')
    async findProductsWithMissingImages() {
        // Find products without primary images
        return { message: 'Missing images health check - implement based on media validation' };
    }

    @Get('health/missing-descriptions')
    async findProductsWithMissingDescriptions() {
        // Find products without descriptions
        return { message: 'Missing descriptions health check - implement validation' };
    }

    @Get('health/invalid-pricing')
    async findProductsWithInvalidPricing() {
        // Find products with pricing issues
        return { message: 'Invalid pricing health check - implement validation' };
    }
} 