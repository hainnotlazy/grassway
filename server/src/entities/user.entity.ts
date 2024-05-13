import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { SALT_ROUNDS } from "src/common/constants/bcrypt.const";
import { Exclude } from "class-transformer";

enum GenderTypes {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column() // Max length of bcrypt 72 bytes
  @Exclude()
  password: string;

  @Column({ nullable: true })
  fullname: string;

  @Column({ nullable: true, type: "date" })
  dob: Date;
  
  @Column({
    type: "enum",
    enum: GenderTypes,
    default: GenderTypes.OTHER
  })
  gender: string;

  // TODO: Add to db erd
  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  slack: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ default: true })
  @Exclude()
  is_active: boolean;

  @Column({ default: false })
  @Exclude()
  is_email_verified: boolean;

  @Column({ nullable: true })
  @Exclude()
  email_verification_code: number;

  @Column({ nullable: true })
  @Exclude()
  next_email_verification_time: Date;

  @CreateDateColumn()
  @Exclude()
  created_at: Date;

  @UpdateDateColumn()
  @Exclude()
  updated_at: Date;

  @BeforeInsert()
  handleBeforeInsert() {
    console.log(4567)
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

  @BeforeUpdate()
  handleBeforeUpdate() {
    // Hash password
    if (this.password) {
      console.log("was here");
      // this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
    }
  }
}