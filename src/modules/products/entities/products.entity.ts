import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Product catalog information
  @Column('text', { nullable: true })
  catalog!: object;

  // Pricing and financial data
  @Column('text', { nullable: true })
  pricing!: object;

  // Inventory management data
  @Column('text', { nullable: true })
  inventory!: object;

  // Technical specifications and features
  @Column('text', { nullable: true })
  specifications!: object;

  // Media assets (images, videos, documents)
  @Column('text', { nullable: true })
  media!: object;

  // SEO and marketing data
  @Column('text', { nullable: true })
  seo!: object;

  // Product variants and combinations
  @Column('text', { nullable: true })
  variants!: object;

  // Categories and relationships
  @Column('text', { nullable: true })
  categories!: object;

  // Compliance and regulatory data
  @Column('text', { nullable: true })
  compliance!: object;

  // Additional product metadata
  @Column({ type: 'datetime', nullable: true })
  createdDate!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  approvedBy!: string;

  // Standard audit fields
  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
} 