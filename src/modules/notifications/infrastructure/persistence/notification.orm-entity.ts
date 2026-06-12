import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { UserOrmEntity } from "@/modules/users/infrastructure/persistence/user.orm-entity";

@Entity("notifications")
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column()
  type!: string;

  @Column()
  title!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ type: "jsonb", default: "{}" })
  metadata!: Record<string, any>;

  @ManyToOne(() => UserOrmEntity)
  @JoinColumn({ name: "userId" })
  user!: UserOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
