import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "./user.orm-entity";

@Entity("user_profiles")
export class UserProfileOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ nullable: true })
  preferredLocation?: string;

  @Column({ type: "decimal", nullable: true })
  budgetMin?: number;

  @Column({ type: "decimal", nullable: true })
  budgetMax?: number;

  @Column({ nullable: true, default:"https://www.clipartmax.com/png/middle/144-1442578_flat-person-icon-download-dummy-man.png" })
  profileImage?: string;

  // Native Postgres string arrays
  @Column("text", { array: true, default: [] })
  operatingStates!: string[]; // e.g., ["Lagos", "Ogun"]

  @Column("text", { array: true, default: [] })
  operatingLgas!: string[];   // e.g., ["Eti-Osa", "Ikeja", "Abeokuta South"]

  @Column("text", { array: true, default: [] })
  operatingCities!: string[];  // e.g., ["Lagos", "Ikeja", "Abeokuta South"]

  @Column({ unique: true, nullable: true })
  slug?: string;

  @OneToOne(() => UserOrmEntity, user => user.profile)
  @JoinColumn()
  user!: UserOrmEntity;

  @Column()
  userId!: string;
}
