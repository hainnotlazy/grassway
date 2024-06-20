import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Exclude } from "class-transformer";

export enum NotificationType {
  INFORMATION = "information",
  CONGRATULATION = "congratulation",
  UPDATE_SETTINGS = "update_settings",
}

@Entity()
export class UserNotification {
  @PrimaryGeneratedColumn()
  id: number; 
  
  @PrimaryColumn()
  user_id: number;

  @ManyToOne(() => User, user => user.notifications)
  @JoinColumn({ name: "user_id" })
  @Exclude()
  user: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: "enum",
    enum: NotificationType,
    default: NotificationType.INFORMATION
  })
  type: NotificationType;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}