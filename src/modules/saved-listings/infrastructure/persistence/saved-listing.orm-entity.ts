import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";
import { PropertyOrmEntity } from "@/modules/properties/infrastructure/persistence/property.orm-entity";

@Entity("saved_listings")
@Unique(["userId", "propertyId"])
export class SavedListingOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  propertyId!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @ManyToOne(() => PropertyOrmEntity)
  @JoinColumn({ name: "propertyId" })
  property!: PropertyOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
