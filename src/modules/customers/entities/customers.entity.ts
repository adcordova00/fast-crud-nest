import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('customers')
export class CustomersEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Personal information
  @Column('text', { nullable: true })
  personal!: object;

  // Contact information and preferences
  @Column('text', { nullable: true })
  contact!: object;

  // Multiple addresses (home, work, billing, shipping)
  @Column('text', { nullable: true })
  addresses!: object;

  // Business information for B2B customers
  @Column('text', { nullable: true })
  business!: object;

  // Financial information and payment details
  @Column('text', { nullable: true })
  financial!: object;

  // Customer preferences and settings
  @Column('text', { nullable: true })
  preferences!: object;

  // Loyalty program and rewards information
  @Column('text', { nullable: true })
  loyalty!: object;

  // Interaction and purchase history
  @Column('text', { nullable: true })
  history!: object;

  // Segmentation, analytics and marketing data
  @Column('text', { nullable: true })
  segmentation!: object;

  // Customer metadata
  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  customerNumber!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  customerType!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  source!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  assignedTo!: string;

  @Column({ type: 'datetime', nullable: true })
  createdDate!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  createdBy!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  organizationId!: string;

  // Standard audit fields
  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
} 