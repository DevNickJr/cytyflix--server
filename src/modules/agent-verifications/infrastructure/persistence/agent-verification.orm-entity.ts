import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";

@Entity("agent_verifications")
export class AgentVerificationOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  userId!: string;

  @Column()
  idDocumentUrl!: string;

  @Column()
  selfieUrl!: string;

  @Column({ default: "pending" })
  status!: string;

  @Column({ type: "text", nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: "timestamp", nullable: true })
  reviewedAt?: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: "reviewedBy" })
  reviewer?: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
