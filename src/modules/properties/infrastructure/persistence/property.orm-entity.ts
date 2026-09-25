import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserOrmEntity } from '@/modules/users/infrastructure/persistence/user.orm-entity';

@Entity('properties')
export class PropertyOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', nullable: false })
  propertyType!: string;

  @Column({ type: 'varchar', nullable: false })
  listingType!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ type: 'varchar', default: 'month' })
  pricePeriod!: string;

  @Column({ type: 'boolean', default: false })
  negotiable!: boolean;

  @Column({ type: 'varchar', default: 'NGN' })
  currency!: string;

  @Column({ type: 'varchar', nullable: false })
  address!: string;

  @Column({ type: 'varchar', nullable: false })
  city!: string; // city or ward

  @Column({ type: 'varchar', nullable: false })
  lga!: string;

  @Column({ type: 'varchar', nullable: false })
  state!: string;

  @Column({ type: 'varchar', nullable: false, default: 'Nigeria' })
  country!: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'int', default: 1 })
  bedrooms!: number;

  @Column({ type: 'int', default: 1 })
  bathrooms!: number;

  @Column({ type: 'jsonb', default: '[]' })
  amenities!: string[];

  @Column({ type: 'jsonb', default: '[]' })
  proofOfOwnership!: string[];

  @Column({ type: 'jsonb', default: '[]' })
  images!: string[];

  @Column({ type: 'jsonb', default: '[]' })
  interiorImages!: string[];

  @Column({ type: 'jsonb', default: '[]' })
  exteriorImages!: string[];

  @Column({ type: 'jsonb', default: '[]' })
  streetImages!: string[];

  @Column({ type: 'text', nullable: true })
  walkthroughVideo?: string;

  @Column({ type: 'boolean', default: true })
  isAvailable!: boolean;

  @Column({ type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ type: 'boolean', default: false })
  isFrozen!: boolean;

  @Column({ type: 'text', nullable: true })
  frozenReason?: string;

  @Column({ type: 'varchar', nullable: false })
  ownerId!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'ownerId' })
  owner!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn() // Keeps data, hides it from normal queries
  deletedAt!: Date;
}
