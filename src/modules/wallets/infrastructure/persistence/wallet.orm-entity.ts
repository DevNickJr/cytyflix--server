import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";

@Entity("wallets")
export class WalletOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @Column({ type: "decimal", default: 0 })
  balance!: number;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
