import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { WalletOrmEntity } from "./wallet.orm-entity";

@Entity("wallet_transactions")
export class WalletTransactionOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  walletId!: string;

  @Column()
  type!: string;

  @Column({ type: "decimal" })
  amount!: number;

  @Column({ type: "decimal" })
  balanceAfter!: number;

  @Column()
  status!: string;

  @Column({ unique: true })
  reference!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "jsonb", default: {} })
  metadata!: Record<string, any>;

  @ManyToOne(() => WalletOrmEntity)
  @JoinColumn({ name: "walletId" })
  wallet!: WalletOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
