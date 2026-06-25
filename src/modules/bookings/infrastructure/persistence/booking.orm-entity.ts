import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";

@Entity("bookings")
export class BookingOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  clientId!: string;

  @Column()
  agentId!: string;

  @Column({ nullable: true })
  propertyId!: string | null; 

  @Column({ type: "decimal" })
  amount!: number;

  @Column({ unique: true })
  paymentReference!: string;

  @Column({ default: "pending" })
  paymentStatus!: string;

  @Column({ default: "pending" })
  bookingStatus!: string;

  @Column({ default: false })
  clientConfirmed!: boolean;

  @Column({ default: false })
  agentConfirmed!: boolean;

  @Column()
  scheduledDate!: string;

  @Column()
  scheduledTime!: string;

  @Column({ type: "text", nullable: true })
  notes?: string;

  @Column({ type: "timestamp", nullable: true })
  expiresAt?: Date;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "clientId" })
  client!: UserOrmEntity;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "agentId" })
  agent!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity, { nullable: true })
  @JoinColumn({ name: "propertyId" })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
