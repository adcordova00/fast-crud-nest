declare enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued",
    OUT_OF_STOCK = "out_of_stock",
    COMING_SOON = "coming_soon"
}
declare enum ProductType {
    PHYSICAL = "physical",
    DIGITAL = "digital",
    SERVICE = "service",
    SUBSCRIPTION = "subscription",
    BUNDLE = "bundle",
    GIFT_CARD = "gift_card"
}
declare enum StockStatus {
    IN_STOCK = "in_stock",
    LOW_STOCK = "low_stock",
    OUT_OF_STOCK = "out_of_stock",
    BACKORDER = "backorder",
    PREORDER = "preorder"
}
declare enum PriceType {
    FIXED = "fixed",
    VARIABLE = "variable",
    TIERED = "tiered",
    DYNAMIC = "dynamic"
}
declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    DOCUMENT = "document",
    AUDIO = "audio",
    THREE_D_MODEL = "3d_model"
}
declare enum VariantType {
    SIZE = "size",
    COLOR = "color",
    MATERIAL = "material",
    STYLE = "style",
    WEIGHT = "weight",
    DIMENSION = "dimension",
    CUSTOM = "custom"
}
declare enum UnitOfMeasure {
    PIECE = "piece",
    KILOGRAM = "kg",
    GRAM = "g",
    LITER = "l",
    MILLILITER = "ml",
    METER = "m",
    CENTIMETER = "cm",
    SQUARE_METER = "m2",
    CUBIC_METER = "m3"
}
declare class CatalogDto {
    name: string;
    sku: string;
    barcode: string;
    shortDescription: string;
    longDescription: string;
    type: ProductType;
    status: ProductStatus;
    brand: string;
    manufacturer: string;
    model: string;
    unitOfMeasure: UnitOfMeasure;
    weight: number;
    dimensions: {
        length?: number;
        width?: number;
        height?: number;
        unit?: string;
    };
    tags: string[];
    isFeatured: boolean;
    isDigital: boolean;
    launchDate: string;
    discontinueDate: string;
}
declare class PricingDto {
    basePrice: number;
    salePrice: number;
    costPrice: number;
    currency: string;
    priceType: PriceType;
    tieredPricing: Array<{
        minQuantity: number;
        maxQuantity?: number;
        price: number;
        discountPercentage?: number;
    }>;
    discounts: {
        percentage?: number;
        amount?: number;
        startDate?: string;
        endDate?: string;
        minQuantity?: number;
        maxQuantity?: number;
    };
    taxRate: number;
    taxIncluded: boolean;
    allowBackorder: boolean;
    msrp: number;
    priceHistory: Array<{
        price: number;
        effectiveDate: string;
        reason?: string;
    }>;
}
declare class InventoryDto {
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    reorderLevel: number;
    maxStock: number;
    stockStatus: StockStatus;
    locations: Array<{
        warehouseId: string;
        warehouseName: string;
        quantity: number;
        reserved: number;
        location?: string;
    }>;
    trackInventory: boolean;
    allowNegativeStock: boolean;
    lastStockUpdate: string;
    stockMovements: Array<{
        type: 'in' | 'out' | 'adjustment';
        quantity: number;
        reason: string;
        date: string;
        reference?: string;
    }>;
    supplier: {
        supplierId?: string;
        supplierName?: string;
        supplierSku?: string;
        leadTime?: number;
        minOrderQuantity?: number;
    };
}
declare class SpecificationsDto {
    technical: Record<string, any>;
    features: Array<{
        name: string;
        value: string;
        unit?: string;
        category?: string;
    }>;
    materials: Array<{
        name: string;
        percentage?: number;
        origin?: string;
        sustainable?: boolean;
    }>;
    care: {
        instructions?: string[];
        warnings?: string[];
        temperature?: string;
        washable?: boolean;
    };
    certifications: {
        quality?: string[];
        safety?: string[];
        environmental?: string[];
        organic?: boolean;
    };
    compatibility: Array<{
        type: string;
        models: string[];
        versions?: string[];
    }>;
    warranty: {
        duration?: number;
        type?: string;
        coverage?: string;
        terms?: string;
    };
}
declare class MediaDto {
    images: Array<{
        url: string;
        alt: string;
        type: MediaType;
        isPrimary?: boolean;
        sortOrder?: number;
        tags?: string[];
    }>;
    videos: Array<{
        url: string;
        title: string;
        description?: string;
        duration?: number;
        thumbnail?: string;
        type?: 'product_demo' | 'unboxing' | 'tutorial' | 'review';
    }>;
    documents: Array<{
        url: string;
        name: string;
        type: 'manual' | 'datasheet' | 'certificate' | 'warranty' | 'other';
        size?: number;
        language?: string;
    }>;
    threeDModels: Array<{
        url: string;
        format: 'glb' | 'gltf' | 'obj' | 'fbx';
        size?: number;
        quality?: 'low' | 'medium' | 'high';
    }>;
    primaryImageUrl: string;
    thumbnailUrl: string;
}
declare class SeoDto {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    slug: string;
    canonicalUrl: string;
    openGraph: {
        title?: string;
        description?: string;
        image?: string;
        type?: string;
    };
    structuredData: {
        '@type'?: string;
        name?: string;
        description?: string;
        image?: string;
        brand?: string;
        offers?: any;
    };
    searchBoost: number;
    noIndex: boolean;
    noFollow: boolean;
}
declare class VariantsDto {
    hasVariants: boolean;
    variantOptions: Array<{
        type: VariantType;
        name: string;
        values: Array<{
            value: string;
            displayName?: string;
            colorCode?: string;
            image?: string;
            priceModifier?: number;
        }>;
    }>;
    combinations: Array<{
        id?: string;
        sku?: string;
        options: Record<string, string>;
        price?: number;
        stock?: number;
        weight?: number;
        images?: string[];
        status?: ProductStatus;
    }>;
    defaultVariant: string;
    variantPricing: {
        type: 'individual' | 'modifier';
        basePrice?: number;
    };
}
declare class CategoriesDto {
    primaryCategories: string[];
    secondaryCategories: string[];
    collections: Array<{
        id: string;
        name: string;
        type?: 'seasonal' | 'promotional' | 'curated' | 'bestseller';
    }>;
    taxonomy: {
        department?: string;
        category?: string;
        subcategory?: string;
        productGroup?: string;
    };
    crossSellProducts: string[];
    upSellProducts: string[];
    relatedProducts: string[];
    bundleProducts: string[];
}
declare class ComplianceDto {
    regulations: string[];
    ageRestrictions: {
        minimumAge?: number;
        requiresVerification?: boolean;
        region?: string;
    };
    restrictedCountries: string[];
    requiredLicenses: string[];
    isHazardous: boolean;
    shippingRestrictions: {
        airTransport?: boolean;
        groundOnly?: boolean;
        specialHandling?: boolean;
    };
}
export declare class CreateProductsDto {
    catalog: CatalogDto;
    pricing: PricingDto;
    inventory: InventoryDto;
    specifications: SpecificationsDto;
    media: MediaDto;
    seo: SeoDto;
    variants: VariantsDto;
    categories: CategoriesDto;
    compliance: ComplianceDto;
    createdDate: string;
    createdBy: string;
    approvedBy: string;
}
export {};
