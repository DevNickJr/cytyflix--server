import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserOrmEntity } from '@/modules/users/infrastructure/persistence/user.orm-entity';

@Entity('beneficiaries')
export class BeneficiaryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: false })
  userId!: string;

  @Column({ type: 'varchar', nullable: false })
  bankCode!: string;

  @Column({ type: 'varchar', nullable: false })
  bankName!: string;

  @Column({ type: 'varchar', nullable: false })
  accountNumber!: string;

  @Column({ type: 'varchar', nullable: false })
  accountName!: string;

  @Column({ type: 'varchar', nullable: false })
  recipientCode!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: 'userId' })
  user!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
