import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";

@Entity("reports")
export class ReportOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  propertyId!: string;

  @Column()
  reason!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ default: "pending" })
  status!: string;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ type: "timestamp", nullable: true })
  reviewedAt?: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "propertyId" })
  property!: PropertyOrmEntity;

  @ManyToOne(() => UserOrmEntity, { nullable: true })
  @JoinColumn({ name: "reviewedBy" })
  reviewer?: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
