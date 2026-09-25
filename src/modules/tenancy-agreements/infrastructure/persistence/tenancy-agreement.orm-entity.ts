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

@Entity('tenancy_agreements')
export class TenancyAgreementOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  propertyId!: string;

  @Column()
  landlordId!: string;

  @Column()
  tenantId!: string;

  @Column({ type: 'text' })
  agreementContent!: string;

  @Column({ type: 'text', nullable: true })
  landlordSignature!: string | null;

  @Column({ type: 'text', nullable: true })
  tenantSignature!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  landlordSignedAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  tenantSignedAt!: Date | null;

  @Column({ default: 'pending_tenant' })
  status!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'landlordId' })
  landlord!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'tenantId' })
  tenant!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity)
  @JoinColumn({ name: 'propertyId' })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
