import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('onboarding')
export class OnboardingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', { nullable: true })
  identity!: object;

  @Column('text', { nullable: true })
  contact!: object;

  @Column('text', { nullable: true })
  residentialAddress!: object;

  @Column('text', { nullable: true })
  shippingAddress!: object;

  @Column('text', { nullable: true })
  personal!: object;

  @Column('text', { nullable: true })
  employment!: object;

  @Column('text', { nullable: true })
  financial!: object;

  @Column('text', { nullable: true })
  academic!: object;

  @Column('text', { nullable: true })
  health!: object;

  @Column('text', { nullable: true })
  security!: object;

  @Column('text', { nullable: true })
  terms!: object;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}
