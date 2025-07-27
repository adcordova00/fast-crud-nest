import {
    IsString,
    IsOptional,
    IsEmail,
    IsPhoneNumber,
    IsBoolean,
    IsDateString,
    IsNumber,
    ValidateNested,
    IsArray,
    IsUrl,
    IsEnum,
    MinLength,
    MaxLength,
    IsUUID,
    IsObject,
    Min,
    Max,
    IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';

// Enums for better type safety
enum ProductStatus {
    DRAFT = 'draft',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DISCONTINUED = 'discontinued',
    OUT_OF_STOCK = 'out_of_stock',
    COMING_SOON = 'coming_soon'
}

enum ProductType {
    PHYSICAL = 'physical',
    DIGITAL = 'digital',
    SERVICE = 'service',
    SUBSCRIPTION = 'subscription',
    BUNDLE = 'bundle',
    GIFT_CARD = 'gift_card'
}

enum StockStatus {
    IN_STOCK = 'in_stock',
    LOW_STOCK = 'low_stock',
    OUT_OF_STOCK = 'out_of_stock',
    BACKORDER = 'backorder',
    PREORDER = 'preorder'
}

enum PriceType {
    FIXED = 'fixed',
    VARIABLE = 'variable',
    TIERED = 'tiered',
    DYNAMIC = 'dynamic'
}

enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
    DOCUMENT = 'document',
    AUDIO = 'audio',
    THREE_D_MODEL = '3d_model'
}

enum VariantType {
    SIZE = 'size',
    COLOR = 'color',
    MATERIAL = 'material',
    STYLE = 'style',
    WEIGHT = 'weight',
    DIMENSION = 'dimension',
    CUSTOM = 'custom'
}

enum UnitOfMeasure {
    PIECE = 'piece',
    KILOGRAM = 'kg',
    GRAM = 'g',
    LITER = 'l',
    MILLILITER = 'ml',
    METER = 'm',
    CENTIMETER = 'cm',
    SQUARE_METER = 'm2',
    CUBIC_METER = 'm3'
}

class CatalogDto {
    @IsOptional() @IsString() @MaxLength(200) name!: string;
    @IsOptional() @IsString() @MaxLength(100) sku!: string;
    @IsOptional() @IsString() @MaxLength(100) barcode!: string;
    @IsOptional() @IsString() @MaxLength(500) shortDescription!: string;
    @IsOptional() @IsString() @MaxLength(2000) longDescription!: string;
    @IsOptional() @IsEnum(ProductType) type!: ProductType;
    @IsOptional() @IsEnum(ProductStatus) status!: ProductStatus;
    @IsOptional() @IsString() @MaxLength(100) brand!: string;
    @IsOptional() @IsString() @MaxLength(100) manufacturer!: string;
    @IsOptional() @IsString() @MaxLength(50) model!: string;
    @IsOptional() @IsEnum(UnitOfMeasure) unitOfMeasure!: UnitOfMeasure;
    @IsOptional() @IsNumber() @Min(0) weight!: number;
    @IsOptional() @IsObject() dimensions!: {
        length?: number;
        width?: number;
        height?: number;
        unit?: string;
    };
    @IsOptional() @IsArray() @IsString({ each: true }) tags!: string[];
    @IsOptional() @IsBoolean() isFeatured!: boolean;
    @IsOptional() @IsBoolean() isDigital!: boolean;
    @IsOptional() @IsDateString() launchDate!: string;
    @IsOptional() @IsDateString() discontinueDate!: string;
}

class PricingDto {
    @IsOptional() @IsNumber() @Min(0) basePrice!: number;
    @IsOptional() @IsNumber() @Min(0) salePrice!: number;
    @IsOptional() @IsNumber() @Min(0) costPrice!: number;
    @IsOptional() @IsString() @MaxLength(10) currency!: string;
    @IsOptional() @IsEnum(PriceType) priceType!: PriceType;
    @IsOptional() @IsArray() tieredPricing!: Array<{
        minQuantity: number;
        maxQuantity?: number;
        price: number;
        discountPercentage?: number;
    }>;
    @IsOptional() @IsObject() discounts!: {
        percentage?: number;
        amount?: number;
        startDate?: string;
        endDate?: string;
        minQuantity?: number;
        maxQuantity?: number;
    };
    @IsOptional() @IsNumber() @Min(0) @Max(100) taxRate!: number;
    @IsOptional() @IsBoolean() taxIncluded!: boolean;
    @IsOptional() @IsBoolean() allowBackorder!: boolean;
    @IsOptional() @IsNumber() @Min(0) msrp!: number; // Manufacturer's Suggested Retail Price
    @IsOptional() @IsArray() priceHistory!: Array<{
        price: number;
        effectiveDate: string;
        reason?: string;
    }>;
}

class InventoryDto {
    @IsOptional() @IsNumber() @Min(0) currentStock!: number;
    @IsOptional() @IsNumber() @Min(0) reservedStock!: number;
    @IsOptional() @IsNumber() @Min(0) availableStock!: number;
    @IsOptional() @IsNumber() @Min(0) reorderLevel!: number;
    @IsOptional() @IsNumber() @Min(0) maxStock!: number;
    @IsOptional() @IsEnum(StockStatus) stockStatus!: StockStatus;
    @IsOptional() @IsArray() locations!: Array<{
        warehouseId: string;
        warehouseName: string;
        quantity: number;
        reserved: number;
        location?: string; // Shelf/bin location
    }>;
    @IsOptional() @IsBoolean() trackInventory!: boolean;
    @IsOptional() @IsBoolean() allowNegativeStock!: boolean;
    @IsOptional() @IsDateString() lastStockUpdate!: string;
    @IsOptional() @IsArray() stockMovements!: Array<{
        type: 'in' | 'out' | 'adjustment';
        quantity: number;
        reason: string;
        date: string;
        reference?: string;
    }>;
    @IsOptional() @IsObject() supplier!: {
        supplierId?: string;
        supplierName?: string;
        supplierSku?: string;
        leadTime?: number; // days
        minOrderQuantity?: number;
    };
}

class SpecificationsDto {
    @IsOptional() @IsObject() technical!: Record<string, any>;
    @IsOptional() @IsArray() features!: Array<{
        name: string;
        value: string;
        unit?: string;
        category?: string;
    }>;
    @IsOptional() @IsArray() materials!: Array<{
        name: string;
        percentage?: number;
        origin?: string;
        sustainable?: boolean;
    }>;
    @IsOptional() @IsObject() care!: {
        instructions?: string[];
        warnings?: string[];
        temperature?: string;
        washable?: boolean;
    };
    @IsOptional() @IsObject() certifications!: {
        quality?: string[];
        safety?: string[];
        environmental?: string[];
        organic?: boolean;
    };
    @IsOptional() @IsArray() compatibility!: Array<{
        type: string;
        models: string[];
        versions?: string[];
    }>;
    @IsOptional() @IsObject() warranty!: {
        duration?: number; // months
        type?: string;
        coverage?: string;
        terms?: string;
    };
}

class MediaDto {
    @IsOptional() @IsArray() images!: Array<{
        url: string;
        alt: string;
        type: MediaType;
        isPrimary?: boolean;
        sortOrder?: number;
        tags?: string[];
    }>;
    @IsOptional() @IsArray() videos!: Array<{
        url: string;
        title: string;
        description?: string;
        duration?: number; // seconds
        thumbnail?: string;
        type?: 'product_demo' | 'unboxing' | 'tutorial' | 'review';
    }>;
    @IsOptional() @IsArray() documents!: Array<{
        url: string;
        name: string;
        type: 'manual' | 'datasheet' | 'certificate' | 'warranty' | 'other';
        size?: number; // bytes
        language?: string;
    }>;
    @IsOptional() @IsArray() threeDModels!: Array<{
        url: string;
        format: 'glb' | 'gltf' | 'obj' | 'fbx';
        size?: number;
        quality?: 'low' | 'medium' | 'high';
    }>;
    @IsOptional() @IsString() primaryImageUrl!: string;
    @IsOptional() @IsString() thumbnailUrl!: string;
}

class SeoDto {
    @IsOptional() @IsString() @MaxLength(60) metaTitle!: string;
    @IsOptional() @IsString() @MaxLength(160) metaDescription!: string;
    @IsOptional() @IsArray() @IsString({ each: true }) keywords!: string[];
    @IsOptional() @IsString() @MaxLength(100) slug!: string;
    @IsOptional() @IsString() canonicalUrl!: string;
    @IsOptional() @IsObject() openGraph!: {
        title?: string;
        description?: string;
        image?: string;
        type?: string;
    };
    @IsOptional() @IsObject() structuredData!: {
        '@type'?: string;
        name?: string;
        description?: string;
        image?: string;
        brand?: string;
        offers?: any;
    };
    @IsOptional() @IsNumber() @Min(0) @Max(10) searchBoost!: number;
    @IsOptional() @IsBoolean() noIndex!: boolean;
    @IsOptional() @IsBoolean() noFollow!: boolean;
}

class VariantsDto {
    @IsOptional() @IsBoolean() hasVariants!: boolean;
    @IsOptional() @IsArray() variantOptions!: Array<{
        type: VariantType;
        name: string;
        values: Array<{
            value: string;
            displayName?: string;
            colorCode?: string; // for color variants
            image?: string;
            priceModifier?: number;
        }>;
    }>;
    @IsOptional() @IsArray() combinations!: Array<{
        id?: string;
        sku?: string;
        options: Record<string, string>; // e.g., {"size": "L", "color": "red"}
        price?: number;
        stock?: number;
        weight?: number;
        images?: string[];
        status?: ProductStatus;
    }>;
    @IsOptional() @IsString() defaultVariant!: string; // variant ID
    @IsOptional() @IsObject() variantPricing!: {
        type: 'individual' | 'modifier';
        basePrice?: number;
    };
}

class CategoriesDto {
    @IsOptional() @IsArray() @IsString({ each: true }) primaryCategories!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) secondaryCategories!: string[];
    @IsOptional() @IsArray() collections!: Array<{
        id: string;
        name: string;
        type?: 'seasonal' | 'promotional' | 'curated' | 'bestseller';
    }>;
    @IsOptional() @IsObject() taxonomy!: {
        department?: string;
        category?: string;
        subcategory?: string;
        productGroup?: string;
    };
    @IsOptional() @IsArray() @IsString({ each: true }) crossSellProducts!: string[]; // Product IDs
    @IsOptional() @IsArray() @IsString({ each: true }) upSellProducts!: string[]; // Product IDs
    @IsOptional() @IsArray() @IsString({ each: true }) relatedProducts!: string[]; // Product IDs
    @IsOptional() @IsArray() @IsString({ each: true }) bundleProducts!: string[]; // For bundle products
}

class ComplianceDto {
    @IsOptional() @IsArray() @IsString({ each: true }) regulations!: string[];
    @IsOptional() @IsObject() ageRestrictions!: {
        minimumAge?: number;
        requiresVerification?: boolean;
        region?: string;
    };
    @IsOptional() @IsArray() @IsString({ each: true }) restrictedCountries!: string[];
    @IsOptional() @IsArray() @IsString({ each: true }) requiredLicenses!: string[];
    @IsOptional() @IsBoolean() isHazardous!: boolean;
    @IsOptional() @IsObject() shippingRestrictions!: {
        airTransport?: boolean;
        groundOnly?: boolean;
        specialHandling?: boolean;
    };
}

export class CreateProductsDto {
    @ValidateNested() @Type(() => CatalogDto)
    catalog!: CatalogDto;

    @ValidateNested() @Type(() => PricingDto)
    pricing!: PricingDto;

    @ValidateNested() @Type(() => InventoryDto)
    inventory!: InventoryDto;

    @ValidateNested() @Type(() => SpecificationsDto)
    specifications!: SpecificationsDto;

    @ValidateNested() @Type(() => MediaDto)
    media!: MediaDto;

    @ValidateNested() @Type(() => SeoDto)
    seo!: SeoDto;

    @ValidateNested() @Type(() => VariantsDto)
    variants!: VariantsDto;

    @ValidateNested() @Type(() => CategoriesDto)
    categories!: CategoriesDto;

    @ValidateNested() @Type(() => ComplianceDto)
    compliance!: ComplianceDto;

    @IsOptional() @IsDateString()
    createdDate!: string;

    @IsOptional() @IsString()
    createdBy!: string;

    @IsOptional() @IsString()
    approvedBy!: string;
} 