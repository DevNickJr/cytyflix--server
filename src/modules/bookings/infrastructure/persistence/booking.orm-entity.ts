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

@Entity('bookings')
export class BookingOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  clientId!: string;

  @Column({ type: 'varchar', nullable: false })
  agentId!: string;

  @Column({ type: 'varchar', nullable: true })
  propertyId!: string | null;

  @Column({ type: 'decimal' })
  amount!: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  paymentReference!: string;

  @Column({ type: 'varchar', nullable: false })
  paymentStatus!: string;

  @Column({ type: 'varchar', nullable: false })
  bookingStatus!: string;

  @Column({ type: 'boolean', default: false })
  clientConfirmed!: boolean;

  @Column({ type: 'boolean', default: false })
  agentConfirmed!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  scheduledDate!: Date;

  @Column({ type: 'varchar', nullable: false })
  scheduledTime!: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'clientId' })
  client!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'agentId' })
  agent!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity, { nullable: true })
  @JoinColumn({ name: 'propertyId' })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
