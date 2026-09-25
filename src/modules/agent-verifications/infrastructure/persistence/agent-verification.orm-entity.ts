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

@Entity('agent_verifications')
export class AgentVerificationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  userId!: string;

  @Column({ type: 'varchar', nullable: false })
  idDocumentUrl!: string;

  @Column({ type: 'varchar', nullable: false })
  selfieUrl!: string;

  @Column({ type: 'varchar', nullable: true })
  utilityBillUrl?: string;

  @Column({ type: 'text', nullable: true })
  ninNumber?: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  ninVerified!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  ninData?: Record<string, unknown>;

  @Column({ type: 'varchar', nullable: false, default: 'pending' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'varchar', nullable: true })
  reviewedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: 'reviewedBy' })
  reviewer?: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
