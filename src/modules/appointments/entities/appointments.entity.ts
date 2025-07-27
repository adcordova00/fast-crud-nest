import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
export class AppointmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Schedule and timing information
  @Column('text', { nullable: true })
  schedule!: object;

  // Service being provided
  @Column('text', { nullable: true })
  service!: object;

  // Participants (client, provider, assistants, etc.)
  @Column('text', { nullable: true })
  participants!: object;

  // Location details (physical or virtual)
  @Column('text', { nullable: true })
  location!: object;

  // Recurrence settings for recurring appointments
  @Column('text', { nullable: true })
  recurrence!: object;

  // Reminder configuration and status
  @Column('text', { nullable: true })
  reminders!: object;

  // Payment and billing information
  @Column('text', { nullable: true })
  payment!: object;

  // Availability and scheduling rules
  @Column('text', { nullable: true })
  availability!: object;

  // Additional metadata and custom fields
  @Column('text', { nullable: true })
  metadata!: object;

  // Additional appointment metadata
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