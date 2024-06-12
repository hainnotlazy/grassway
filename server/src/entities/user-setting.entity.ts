import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class UserSetting {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, user => user.setting)
  @JoinColumn({ name: "user_id" })
  @Exclude()
  user: User;

  @Column({
    default: "#000000",
    length: 7
  })
  qr_code_background_color: string;

  @Column({
    default: "#ffffff",
    length: 7
  })
  qr_code_foreground_color: string;

  @Column({
    default: true
  })
  qr_code_show_logo: boolean;

  @Column({
    nullable: true
  })
  qr_code_logo_url: string;

  @UpdateDateColumn()
  updated_at: Date;
}