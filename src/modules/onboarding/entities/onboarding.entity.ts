import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('onboarding')
export class OnboardingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('jsonb', { nullable: true })
  identity!: object;

  @Column('jsonb', { nullable: true })
  contact!: object;

  @Column('jsonb', { nullable: true })
  residentialAddress!: object;

  @Column('jsonb', { nullable: true })
  shippingAddress!: object;

  @Column('jsonb', { nullable: true })
  personal!: object;

  @Column('jsonb', { nullable: true })
  employment!: object;

  @Column('jsonb', { nullable: true })
  financial!: object;

  @Column('jsonb', { nullable: true })
  academic!: object;

  @Column('jsonb', { nullable: true })
  health!: object;

  @Column('jsonb', { nullable: true })
  security!: object;

  @Column('jsonb', { nullable: true })
  terms!: object;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
