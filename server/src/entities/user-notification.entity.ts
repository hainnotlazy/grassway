import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Exclude } from "class-transformer";

export enum NotificationType {
  INFORMATION = "information",
  CONGRATULATION = "congratulation",
  UPDATE_PROFILE = "update_profile",
  UPDATE_SETTINGS = "update_settings",
  BRAND_CREATED = "brand_created",
  BRAND_INVITATION = "brand_invitation",
  BRAND_MEMBER_JOINED = "brand_member_joined",
  BRAND_MEMBER_LEFT = "brand_member_left",
  BRAND_DESTROYED = "brand_member_removed",
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