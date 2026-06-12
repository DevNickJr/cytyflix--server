import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";

@Entity("inquiries")
export class InquiryOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  senderId!: string;

  @Column()
  propertyId!: string;

  @Column()
  recipientId!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ default: "pending" })
  status!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "senderId" })
  sender!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "recipientId" })
  recipient!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity)
  @JoinColumn({ name: "propertyId" })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
