import { ProductsRepositoryPort } from '../../core/ports/products-repository.port';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
export declare class ProductsService {
    private readonly repository;
    constructor(repository: ProductsRepositoryPort);
    create(dto: CreateProductsDto): Promise<any>;
    findAll(params?: any): Promise<any[]>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateProductsDto): Promise<any>;
    softDelete(id: string): Promise<void>;
    findBySku(sku: string): Promise<any>;
    findByBarcode(barcode: string): Promise<any>;
    findByCategory(category: string): Promise<any[]>;
    findByBrand(brand: string): Promise<any[]>;
    updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<void>;
    reserveStock(id: string, quantity: number): Promise<boolean>;
    getLowStock(threshold?: number): Promise<any[]>;
    updatePrice(id: string, newPrice: number, reason?: string): Promise<void>;
    applyDiscount(id: string, discount: any): Promise<void>;
    searchProducts(query: any): Promise<any>;
    findVariants(productId: string): Promise<any[]>;
    updateVariantStock(productId: string, variantId: string, quantity: number): Promise<void>;
    getProductStats(): Promise<any>;
    getPopularProducts(limit?: number): Promise<any[]>;
    getFeaturedProducts(limit?: number): Promise<any[]>;
    bulkUpdateStatus(productIds: string[], status: string): Promise<void>;
    bulkImport(data: CreateProductsDto[]): Promise<any>;
    updatePrimaryImage(id: string, imageUrl: string): Promise<void>;
    addMedia(id: string, media: {
        url: string;
        type: string;
        alt?: string;
    }): Promise<void>;
    updateSeoData(id: string, seoData: any): Promise<void>;
}
