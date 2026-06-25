import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity("analytics_events")
@Index(["eventType", "targetId", "createdAt"])
@Index(["eventType", "createdAt"])
export class AnalyticsEventOrmEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  eventType!: string;

  @Column()
  targetId!: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ type: "jsonb", nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
