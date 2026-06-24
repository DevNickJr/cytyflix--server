import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";

@Entity("reviews")
@Unique(["userId", "propertyId"])
export class ReviewOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  propertyId!: string;

  @Column({ type: "int" })
  rating!: number;

  @Column({ type: "text" })
  comment!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "propertyId" })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
