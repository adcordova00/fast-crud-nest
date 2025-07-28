import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
declare class UpdateStockDto {
    quantity: number;
    operation: 'add' | 'subtract' | 'set';
    reason?: string;
}
declare class ReserveStockDto {
    quantity: number;
}
declare class UpdatePriceDto {
    newPrice: number;
    reason?: string;
}
declare class ApplyDiscountDto {
    percentage?: number;
    amount?: number;
    startDate?: string;
    endDate?: string;
    minQuantity?: number;
    maxQuantity?: number;
}
declare class AddMediaDto {
    url: string;
    type: string;
    alt?: string;
}
declare class BulkUpdateStatusDto {
    productIds: string[];
    status: string;
}
declare class BulkImportDto {
    products: CreateProductsDto[];
}
declare class SearchProductsDto {
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
export declare class ProductsController {
    private readonly service;
    constructor(service: ProductsService);
    create(dto: CreateProductsDto): Promise<any>;
    findAll(page?: number, limit?: number, search?: string, category?: string, brand?: string, status?: string, featured?: boolean): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateProductsDto): Promise<any>;
    softDelete(id: string): Promise<void>;
    searchProducts(query: SearchProductsDto): Promise<any>;
    findBySku(sku: string): Promise<any>;
    findByBarcode(barcode: string): Promise<any>;
    findByCategory(category: string): Promise<any[]>;
    findByBrand(brand: string): Promise<any[]>;
    updateStock(id: string, stockData: UpdateStockDto): Promise<void>;
    reserveStock(id: string, reserveData: ReserveStockDto): Promise<{
        success: boolean;
        reserved: number;
    }>;
    getLowStock(threshold?: number): Promise<any[]>;
    updatePrice(id: string, priceData: UpdatePriceDto): Promise<void>;
    applyDiscount(id: string, discountData: ApplyDiscountDto): Promise<void>;
    findVariants(productId: string): Promise<any[]>;
    updateVariantStock(productId: string, variantId: string, stockData: {
        quantity: number;
    }): Promise<void>;
    updatePrimaryImage(id: string, imageData: {
        imageUrl: string;
    }): Promise<void>;
    addMedia(id: string, mediaData: AddMediaDto): Promise<{
        message: string;
    }>;
    updateSeoData(id: string, seoData: any): Promise<void>;
    getProductStats(): Promise<any>;
    getPopularProducts(limit?: number): Promise<any[]>;
    getFeaturedProducts(limit?: number): Promise<any[]>;
    bulkUpdateStatus(bulkData: BulkUpdateStatusDto): Promise<void>;
    bulkImport(importData: BulkImportDto): Promise<any>;
    getCategories(): Promise<{
        message: string;
    }>;
    getBrands(): Promise<{
        message: string;
    }>;
    getCollections(): Promise<{
        message: string;
    }>;
    getRelatedProducts(id: string): Promise<{
        message: string;
    }>;
    getCrossSellProducts(id: string): Promise<{
        message: string;
    }>;
    getUpSellProducts(id: string): Promise<{
        message: string;
    }>;
    getProductReviews(id: string, page?: number, limit?: number): Promise<{
        message: string;
        productId: string;
        page: number;
        limit: number;
    }>;
    getReviewsSummary(id: string): Promise<{
        message: string;
        productId: string;
    }>;
    checkAvailability(id: string): Promise<{
        productId: string;
        available: boolean;
        stock: any;
        status: any;
        stockStatus: any;
    }>;
    checkQuantityAvailability(id: string, quantity: number): Promise<{
        productId: string;
        requestedQuantity: number;
        available: boolean;
        availableStock: any;
        canFulfill: boolean;
    }>;
    exportToCsv(filters: any): Promise<{
        message: string;
        filters: any;
    }>;
    exportToExcel(filters: any): Promise<{
        message: string;
        filters: any;
    }>;
    duplicateProduct(id: string): Promise<any>;
    findProductsWithMissingImages(): Promise<{
        message: string;
    }>;
    findProductsWithMissingDescriptions(): Promise<{
        message: string;
    }>;
    findProductsWithInvalidPricing(): Promise<{
        message: string;
    }>;
}
export {};
