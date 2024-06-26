import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BrandSocialPlatforms } from "./brand-social-platforms.entity";
import { BrandMember } from "./brand-member.entity";

@Entity()
export class Brand {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => BrandSocialPlatforms, social_platforms => social_platforms.brand)
  social_platforms: BrandSocialPlatforms;

  @OneToMany(() => BrandMember, member => member.brand)
  members: BrandMember[];

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ unique: true })
  prefix: string;

  @Column({ nullable: true })
  logo: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}