import { 
  CreateProductsDto,
} from './create-products.dto';

// Extraer los tipos de las clases internas del CreateProductsDto
type CatalogDto = CreateProductsDto['catalog'];
type PricingDto = CreateProductsDto['pricing'];
type InventoryDto = CreateProductsDto['inventory'];
type SpecificationsDto = CreateProductsDto['specifications'];
type MediaDto = CreateProductsDto['media'];
type SeoDto = CreateProductsDto['seo'];
type VariantsDto = CreateProductsDto['variants'];
type CategoriesDto = CreateProductsDto['categories'];
type ComplianceDto = CreateProductsDto['compliance'];

export class UpdateProductsDto {
  catalog?: Partial<CatalogDto>;
  pricing?: Partial<PricingDto>;
  inventory?: Partial<InventoryDto>;
  specifications?: Partial<SpecificationsDto>;
  media?: Partial<MediaDto>;
  seo?: Partial<SeoDto>;
  variants?: Partial<VariantsDto>;
  categories?: Partial<CategoriesDto>;
  compliance?: Partial<ComplianceDto>;
  createdDate?: string;
  createdBy?: string;
  approvedBy?: string;
} 