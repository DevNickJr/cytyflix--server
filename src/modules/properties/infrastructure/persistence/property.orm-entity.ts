import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
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
  city!: string;

  @Column()
  state!: string;

  @Column({ default: "Nigeria" })
  country!: string;

  @Column({ type: "decimal", nullable: true })
  latitude?: number;

  @Column({ type: "decimal", nullable: true })
  longitude?: number;

  @Column({ type: "int", default: 1 })
  bedrooms!: number;

  @Column({ type: "int", default: 1 })
  bathrooms!: number;

  @Column({ type: "jsonb", default: "[]" })
  amenities!: string[];

  @Column({ type: "jsonb", default: "[]" })
  images!: string[];

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
}
