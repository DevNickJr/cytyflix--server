import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from '@/modules/users/infrastructure/persistence/user.orm-entity';
import { PropertyOrmEntity } from '@/modules/properties/infrastructure/persistence/property.orm-entity';

@Entity('rent_payments')
export class RentPaymentOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  propertyId!: string;

  @Column({ type: 'varchar', nullable: false })
  tenantId!: string;

  @Column({ type: 'varchar', nullable: false })
  ownerId!: string;

  @Column({ type: 'decimal' })
  amount!: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  paymentReference!: string;

  @Column({ type: 'varchar', nullable: false, default: 'pending' })
  paymentStatus!: string;

  @Column({ type: 'varchar', nullable: false, default: 'pending' })
  status!: string;

  @Column({ type: 'timestamp' })
  moveInDate!: Date;

  @Column({ type: 'boolean', default: false })
  tenantConfirmed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'tenantId' })
  tenant!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'ownerId' })
  owner!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity)
  @JoinColumn({ name: 'propertyId' })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
