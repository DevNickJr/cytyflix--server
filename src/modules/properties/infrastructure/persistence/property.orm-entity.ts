import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, DeleteDateColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";

@Entity("properties")
export class PropertyOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column()
  propertyType!: string;

  @Column()
  listingType!: string;

  @Column({ type: "decimal" })
  price!: number;

  @Column({ default: "NGN" })
  currency!: string;

  @Column()
  address!: string;

  @Column()
  city!: string; // city or ward
  
  @Column({ nullable: false })
  lga!: string;

  @Column()
  state!: string;

  @Column({ default: "Nigeria" })
  country!: string;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: "int", default: 1 })
  bedrooms!: number;

  @Column({ type: "int", default: 1 })
  bathrooms!: number;

  @Column({ type: "jsonb", default: "[]" })
  amenities!: string[];

  @Column({ type: "jsonb", default: "[]" })
  proofOfOwnership!: string[];

  @Column({ type: "jsonb", default: "[]" })
  interiorImages!: string[];

  @Column({ type: "jsonb", default: "[]" })
  exteriorImages!: string[];

  @Column({ type: "jsonb", default: "[]" })
  streetImages!: string[];

  @Column({ default: true })
  isAvailable!: boolean;

  @Column({ default: false })
  isFeatured!: boolean;

  @Column()
  ownerId!: string;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "ownerId" })
  owner!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn() // Keeps data, hides it from normal queries
  deletedAt!: Date;
}
