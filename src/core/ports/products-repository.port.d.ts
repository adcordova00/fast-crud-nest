import { CreateProductsDto } from '../../modules/products/dto/create-products.dto';
export declare const PRODUCTS_REPOSITORY_PORT = "ProductsRepositoryPort";
export interface ProductsRepositoryPort {
    create(data: CreateProductsDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, data: any): Promise<any>;
    softDelete(id: string): Promise<void>;
    findBySku(sku: string): Promise<any>;
    findByBarcode(barcode: string): Promise<any>;
    findBySlug(slug: string): Promise<any>;
    findByStatus(status: string): Promise<any[]>;
    findByCategory(category: string): Promise<any[]>;
    findByBrand(brand: string): Promise<any[]>;
    findByType(type: string): Promise<any[]>;
    updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<void>;
    reserveStock(id: string, quantity: number): Promise<boolean>;
    releaseStock(id: string, quantity: number): Promise<void>;
    getLowStock(threshold?: number): Promise<any[]>;
    getOutOfStock(): Promise<any[]>;
    updatePrice(id: string, newPrice: number, reason?: string): Promise<void>;
    applyDiscount(id: string, discount: {
        percentage?: number;
        amount?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<void>;
    removeDiscount(id: string): Promise<void>;
    getPriceHistory(id: string): Promise<any[]>;
    findVariants(productId: string): Promise<any[]>;
    findByVariantOptions(options: Record<string, string>): Promise<any>;
    updateVariantStock(productId: string, variantId: string, quantity: number): Promise<void>;
    findRelatedProducts(id: string): Promise<any[]>;
    findCrossSellProducts(id: string): Promise<any[]>;
    findUpSellProducts(id: string): Promise<any[]>;
    findBundleProducts(id: string): Promise<any[]>;
    findByCollection(collectionId: string): Promise<any[]>;
    updatePrimaryImage(id: string, imageUrl: string): Promise<void>;
    addMedia(id: string, media: {
        url: string;
        type: string;
        alt?: string;
    }): Promise<void>;
    removeMedia(id: string, mediaUrl: string): Promise<void>;
    findByKeyword(keyword: string): Promise<any[]>;
    updateSeoData(id: string, seoData: any): Promise<void>;
    searchProducts(query: {
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
    }): Promise<{
        products: any[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getPopularProducts(limit?: number): Promise<any[]>;
    getFeaturedProducts(limit?: number): Promise<any[]>;
    getNewProducts(days?: number): Promise<any[]>;
    getProductStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        outOfStock: number;
        lowStock: number;
        variants: number;
    }>;
    bulkUpdateStatus(productIds: string[], status: string): Promise<void>;
    bulkUpdatePrices(updates: Array<{
        id: string;
        price: number;
    }>): Promise<void>;
    bulkUpdateStock(updates: Array<{
        id: string;
        quantity: number;
    }>): Promise<void>;
    bulkDelete(productIds: string[]): Promise<void>;
    validateImportData(data: any[]): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    bulkImport(data: CreateProductsDto[]): Promise<{
        success: number;
        failed: number;
        errors: any[];
    }>;
    exportProducts(filters?: any): Promise<any[]>;
}
