import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Exclude } from "class-transformer";

export enum TagIcon {
  NONE = "none",
  WORK = "work",
  PERSONAL = "personal",
  IMPORTANT = "important",
  EVENTS = "events",
  PROJECTS = "projects",
}

/** 
 * Requirements:
 * - User can create tags if they have less than 10 tags.
 * - Their tag name is unique.
 */
@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => User, (user) => user.tags)
  owner: User;

  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: TagIcon,
    default: TagIcon.NONE
  })
  icon: string;

  @Column({
    nullable: true
  })
  description: string;

  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;
}