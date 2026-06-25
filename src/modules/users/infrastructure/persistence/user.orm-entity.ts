import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne } from "typeorm";
import { UserProfileOrmEntity } from "./user-profile.orm-entity";
import { RolesEnum } from "@/shared/interfaces";

@Entity("users")
export class UserOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ 
    // type: "enum",
    // enum: RolesEnum,
    default: RolesEnum.RENT_SEEKER 
  })
  role!: string;
  // role!: RolesEnum;

  @Column({ default: true }) // TODO: change this to false in production WHEN we set up email verification
  isVerified!: boolean;

  @OneToOne(() => UserProfileOrmEntity, profile => profile.user, { cascade: true, eager: true })
  profile?: UserProfileOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
