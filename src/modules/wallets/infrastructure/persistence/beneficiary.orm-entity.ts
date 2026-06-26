import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";

@Entity("beneficiaries")
export class BeneficiaryOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  bankCode!: string;

  @Column()
  bankName!: string;

  @Column()
  accountNumber!: string;

  @Column()
  accountName!: string;

  @Column()
  recipientCode!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
