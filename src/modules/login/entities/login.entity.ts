import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class LoginEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Basic authentication data
  @Column('text', { nullable: true })
  basicAuth!: object;

  // User profile information
  @Column('text', { nullable: true })
  profile!: object;

  // Security settings and data
  @Column('text', { nullable: true })
  security!: object;

  // Social media authentication data
  @Column('text', { nullable: true })
  social!: object;

  // User preferences and settings
  @Column('text', { nullable: true })
  preferences!: object;

  // Multi-tenant and organization data
  @Column('text', { nullable: true })
  tenant!: object;

  // Session management data
  @Column('text', { nullable: true })
  session!: object;

  // Terms and conditions acceptance
  @Column('text', { nullable: true })
  terms!: object;

  // Additional registration data
  @Column({ type: 'datetime', nullable: true })
  registrationDate!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referralCode!: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invitedBy!: string;

  // Standard audit fields
  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
} 