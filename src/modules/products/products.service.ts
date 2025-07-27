import { Injectable, Inject } from '@nestjs/common';
import { ProductsRepositoryPort, PRODUCTS_REPOSITORY_PORT } from '../../core/ports/products-repository.port';
import { CreateProductsDto } from './dto/create-products.dto';
import { UpdateProductsDto } from './dto/update-products.dto';
import { FastCrudValidationException } from '../../core/exceptions/validation.exception';
import { FastCrudException } from '../../core/exceptions/fast-crud.exception';

@Injectable()
export class ProductsService {
    constructor(
        @Inject(PRODUCTS_REPOSITORY_PORT)
        private readonly repository: ProductsRepositoryPort,
    ) { }

    /**
     * Creates a new product with comprehensive validation
     */
    async create(dto: CreateProductsDto): Promise<any> {
        try {
            console.log('[FAST-CRUD] ProductsService.create called');
            
            // Validate SKU uniqueness
            if (dto.catalog?.sku) {
                const existingSku = await this.repository.findBySku(dto.catalog.sku);
                if (existingSku) {
                    throw new FastCrudValidationException('SKU already exists', { sku: dto.catalog.sku });
                }
            }

            // Validate barcode uniqueness if provided
            if (dto.catalog?.barcode) {
                const existingBarcode = await this.repository.findByBarcode(dto.catalog.barcode);
                if (existingBarcode) {
                    throw new FastCrudValidationException('Barcode already exists', { barcode: dto.catalog.barcode });
                }
            }

            // Validate slug uniqueness for SEO
            if (dto.seo?.slug) {
                const existingSlug = await this.repository.findBySlug(dto.seo.slug);
                if (existingSlug) {
                    throw new FastCrudValidationException('SEO slug already exists', { slug: dto.seo.slug });
                }
            }

            // Validate pricing
            if (dto.pricing?.basePrice && dto.pricing?.salePrice) {
                if (dto.pricing.salePrice > dto.pricing.basePrice) {
                    throw new FastCrudValidationException('Sale price cannot be higher than base price');
                }
            }

            // Validate inventory
            if (dto.inventory?.currentStock && dto.inventory?.reservedStock) {
                if (dto.inventory.reservedStock > dto.inventory.currentStock) {
                    throw new FastCrudValidationException('Reserved stock cannot exceed current stock');
                }
            }

            return await this.repository.create(dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('CREATE_FAILED', 'Failed to create product', 500, error);
        }
    }

    /**
     * Standard CRUD operations
     */
    async findAll(params: any = {}): Promise<any[]> {
        try {
            return await this.repository.findAll(params);
        } catch (error) {
            throw new FastCrudException('FIND_ALL_FAILED', 'Failed to retrieve products', 500, error);
        }
    }

    async findById(id: string): Promise<any> {
        try {
            const result = await this.repository.findById(id);
            if (!result) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_ONE_FAILED', 'Failed to retrieve product', 500, error);
        }
    }

    async update(id: string, dto: UpdateProductsDto): Promise<any> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            // Validate SKU uniqueness if being updated
            if (dto.catalog?.sku) {
                const existingSku = await this.repository.findBySku(dto.catalog.sku);
                if (existingSku && existingSku.id !== id) {
                    throw new FastCrudValidationException('SKU already exists', { sku: dto.catalog.sku });
                }
            }

            // Validate barcode uniqueness if being updated
            if (dto.catalog?.barcode) {
                const existingBarcode = await this.repository.findByBarcode(dto.catalog.barcode);
                if (existingBarcode && existingBarcode.id !== id) {
                    throw new FastCrudValidationException('Barcode already exists', { barcode: dto.catalog.barcode });
                }
            }

            return await this.repository.update(id, dto);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_FAILED', 'Failed to update product', 500, error);
        }
    }

    async softDelete(id: string): Promise<void> {
        try {
            const exists = await this.repository.findById(id);
            if (!exists) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }
            await this.repository.softDelete(id);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('DELETE_FAILED', 'Failed to delete product', 500, error);
        }
    }

    /**
     * Product-specific search methods
     */
    async findBySku(sku: string): Promise<any> {
        try {
            const result = await this.repository.findBySku(sku);
            if (!result) {
                throw new FastCrudValidationException(`Product with SKU ${sku} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_BY_SKU_FAILED', 'Failed to find product by SKU', 500, error);
        }
    }

    async findByBarcode(barcode: string): Promise<any> {
        try {
            const result = await this.repository.findByBarcode(barcode);
            if (!result) {
                throw new FastCrudValidationException(`Product with barcode ${barcode} not found`);
            }
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_BY_BARCODE_FAILED', 'Failed to find product by barcode', 500, error);
        }
    }

    async findByCategory(category: string): Promise<any[]> {
        try {
            return await this.repository.findByCategory(category);
        } catch (error) {
            throw new FastCrudException('FIND_BY_CATEGORY_FAILED', 'Failed to find products by category', 500, error);
        }
    }

    async findByBrand(brand: string): Promise<any[]> {
        try {
            return await this.repository.findByBrand(brand);
        } catch (error) {
            throw new FastCrudException('FIND_BY_BRAND_FAILED', 'Failed to find products by brand', 500, error);
        }
    }

    /**
     * Inventory management
     */
    async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set'): Promise<void> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            if (quantity < 0) {
                throw new FastCrudValidationException('Quantity cannot be negative');
            }

            if (operation === 'subtract' && product.inventory?.currentStock < quantity) {
                throw new FastCrudValidationException('Insufficient stock for operation');
            }

            await this.repository.updateStock(id, quantity, operation);
            console.log(`[FAST-CRUD] Stock updated for product ${id}: ${operation} ${quantity}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_STOCK_FAILED', 'Failed to update stock', 500, error);
        }
    }

    async reserveStock(id: string, quantity: number): Promise<boolean> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            const availableStock = (product.inventory?.currentStock || 0) - (product.inventory?.reservedStock || 0);
            if (availableStock < quantity) {
                return false; // Not enough stock available
            }

            return await this.repository.reserveStock(id, quantity);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('RESERVE_STOCK_FAILED', 'Failed to reserve stock', 500, error);
        }
    }

    async getLowStock(threshold: number = 10): Promise<any[]> {
        try {
            return await this.repository.getLowStock(threshold);
        } catch (error) {
            throw new FastCrudException('GET_LOW_STOCK_FAILED', 'Failed to get low stock products', 500, error);
        }
    }

    /**
     * Pricing management
     */
    async updatePrice(id: string, newPrice: number, reason?: string): Promise<void> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            if (newPrice < 0) {
                throw new FastCrudValidationException('Price cannot be negative');
            }

            await this.repository.updatePrice(id, newPrice, reason);
            console.log(`[FAST-CRUD] Price updated for product ${id}: ${newPrice}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_PRICE_FAILED', 'Failed to update price', 500, error);
        }
    }

    async applyDiscount(id: string, discount: any): Promise<void> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            // Validate discount
            if (discount.percentage && (discount.percentage < 0 || discount.percentage > 100)) {
                throw new FastCrudValidationException('Discount percentage must be between 0 and 100');
            }

            if (discount.amount && discount.amount < 0) {
                throw new FastCrudValidationException('Discount amount cannot be negative');
            }

            await this.repository.applyDiscount(id, discount);
            console.log(`[FAST-CRUD] Discount applied to product ${id}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('APPLY_DISCOUNT_FAILED', 'Failed to apply discount', 500, error);
        }
    }

    /**
     * Advanced search functionality
     */
    async searchProducts(query: any): Promise<any> {
        try {
            // Validate search parameters
            if (query.priceMin && query.priceMax && query.priceMin > query.priceMax) {
                throw new FastCrudValidationException('Minimum price cannot be higher than maximum price');
            }

            if (query.page && query.page < 1) {
                throw new FastCrudValidationException('Page number must be greater than 0');
            }

            if (query.limit && (query.limit < 1 || query.limit > 100)) {
                throw new FastCrudValidationException('Limit must be between 1 and 100');
            }

            return await this.repository.searchProducts(query);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('SEARCH_FAILED', 'Failed to search products', 500, error);
        }
    }

    /**
     * Variant management
     */
    async findVariants(productId: string): Promise<any[]> {
        try {
            const product = await this.repository.findById(productId);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${productId} not found`);
            }

            return await this.repository.findVariants(productId);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('FIND_VARIANTS_FAILED', 'Failed to find product variants', 500, error);
        }
    }

    async updateVariantStock(productId: string, variantId: string, quantity: number): Promise<void> {
        try {
            const product = await this.repository.findById(productId);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${productId} not found`);
            }

            if (quantity < 0) {
                throw new FastCrudValidationException('Quantity cannot be negative');
            }

            await this.repository.updateVariantStock(productId, variantId, quantity);
            console.log(`[FAST-CRUD] Variant stock updated: ${productId}/${variantId} = ${quantity}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_VARIANT_STOCK_FAILED', 'Failed to update variant stock', 500, error);
        }
    }

    /**
     * Analytics and reporting
     */
    async getProductStats(): Promise<any> {
        try {
            return await this.repository.getProductStats();
        } catch (error) {
            throw new FastCrudException('GET_STATS_FAILED', 'Failed to get product statistics', 500, error);
        }
    }

    async getPopularProducts(limit: number = 10): Promise<any[]> {
        try {
            return await this.repository.getPopularProducts(limit);
        } catch (error) {
            throw new FastCrudException('GET_POPULAR_FAILED', 'Failed to get popular products', 500, error);
        }
    }

    async getFeaturedProducts(limit: number = 10): Promise<any[]> {
        try {
            return await this.repository.getFeaturedProducts(limit);
        } catch (error) {
            throw new FastCrudException('GET_FEATURED_FAILED', 'Failed to get featured products', 500, error);
        }
    }

    /**
     * Bulk operations
     */
    async bulkUpdateStatus(productIds: string[], status: string): Promise<void> {
        try {
            if (!productIds || productIds.length === 0) {
                throw new FastCrudValidationException('Product IDs array cannot be empty');
            }

            const validStatuses = ['draft', 'active', 'inactive', 'discontinued', 'out_of_stock', 'coming_soon'];
            if (!validStatuses.includes(status)) {
                throw new FastCrudValidationException('Invalid status value');
            }

            await this.repository.bulkUpdateStatus(productIds, status);
            console.log(`[FAST-CRUD] Bulk status update: ${productIds.length} products to ${status}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('BULK_UPDATE_STATUS_FAILED', 'Failed to bulk update status', 500, error);
        }
    }

    async bulkImport(data: CreateProductsDto[]): Promise<any> {
        try {
            if (!data || data.length === 0) {
                throw new FastCrudValidationException('Import data cannot be empty');
            }

            // Validate import data first
            const validation = await this.repository.validateImportData(data);
            if (!validation.valid) {
                throw new FastCrudValidationException('Import data validation failed', { errors: validation.errors });
            }

            const result = await this.repository.bulkImport(data);
            console.log(`[FAST-CRUD] Bulk import completed: ${result.success} success, ${result.failed} failed`);
            return result;
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('BULK_IMPORT_FAILED', 'Failed to bulk import products', 500, error);
        }
    }

    /**
     * Media management
     */
    async updatePrimaryImage(id: string, imageUrl: string): Promise<void> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            await this.repository.updatePrimaryImage(id, imageUrl);
            console.log(`[FAST-CRUD] Primary image updated for product ${id}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_IMAGE_FAILED', 'Failed to update primary image', 500, error);
        }
    }

    async addMedia(id: string, media: { url: string; type: string; alt?: string }): Promise<void> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            const validTypes = ['image', 'video', 'document', 'audio', '3d_model'];
            if (!validTypes.includes(media.type)) {
                throw new FastCrudValidationException('Invalid media type');
            }

            await this.repository.addMedia(id, media);
            console.log(`[FAST-CRUD] Media added to product ${id}: ${media.type}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('ADD_MEDIA_FAILED', 'Failed to add media', 500, error);
        }
    }

    /**
     * SEO management
     */
    async updateSeoData(id: string, seoData: any): Promise<void> {
        try {
            const product = await this.repository.findById(id);
            if (!product) {
                throw new FastCrudValidationException(`Product with ID ${id} not found`);
            }

            // Validate slug uniqueness if provided
            if (seoData.slug) {
                const existingSlug = await this.repository.findBySlug(seoData.slug);
                if (existingSlug && existingSlug.id !== id) {
                    throw new FastCrudValidationException('SEO slug already exists', { slug: seoData.slug });
                }
            }

            await this.repository.updateSeoData(id, seoData);
            console.log(`[FAST-CRUD] SEO data updated for product ${id}`);
        } catch (error) {
            throw error instanceof FastCrudException ? error :
                new FastCrudException('UPDATE_SEO_FAILED', 'Failed to update SEO data', 500, error);
        }
    }
} 