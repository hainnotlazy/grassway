import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { SALT_ROUNDS } from "src/common/constants/bcrypt.const";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Url } from "./url.entity";
import { Tag } from "./tag.entity";
import { UserSetting } from "./user-setting.entity";

enum GenderTypes {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}
@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserSetting, setting => setting.user)
  setting: UserSetting;

  @OneToMany(() => Url, url => url.owner)
  urls: Url[];

  @OneToMany(() => Tag, tag => tag.owner)
  tags: Tag[];

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @Column() // Max length of bcrypt 72 bytes
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  fullname: string;

  @ApiProperty()
  @Column({ nullable: true, type: "date" })
  dob: Date;
  
  @ApiProperty()
  @Column({
    type: "enum",
    enum: GenderTypes,
    default: GenderTypes.OTHER
  })
  gender: string;

  // TODO: Add to db erd
  @ApiProperty()
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @ApiProperty()
  @Column({ nullable: true })
  bio: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  email: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  github: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  twitter: string;

  @ApiProperty()
  @Column({ nullable: true, unique: true })
  facebook: string;

  @Column({ default: true })
  @Exclude()
  is_active: boolean;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ nullable: true })
  @Exclude()
  email_verification_code: number;

  @Column({ nullable: true })
  next_email_verification_time: Date;

  @Column({ nullable: true })
  @Exclude()
  reset_password_code: number;

  @Column({ nullable: true })
  next_forget_password_time: Date;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @BeforeInsert()
  handleBeforeInsert() {
    // Hash Password
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
    }

    // Generate fullname if not provided
    if (!this.fullname) {
      this.fullname = `Unnamed user ${Math.floor(Math.random() * 100000)}`;
    }

    // Generate email verification code if email is provided
    if (this.email && !this.is_email_verified) {
      this.email_verification_code = Math.floor(100000 + Math.random() * 900000);
    }
  }
}