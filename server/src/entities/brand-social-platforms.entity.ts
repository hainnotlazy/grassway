import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { SocialIconPosition, SocialIconStyle } from "./brand.enum";

@Entity()
export class BrandSocialPlatforms {
  @PrimaryColumn("uuid")
  brand_id: string;

  @OneToOne(() => Brand, brand => brand.social_platforms)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @Column({
    type: "enum",
    enum: SocialIconStyle,
    default: SocialIconStyle.COLOR
  })
  icon_style: SocialIconStyle;

  @Column({
    type: "enum",
    enum: SocialIconPosition,
    default: SocialIconPosition.TOP
  })
  icon_position: SocialIconPosition;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: true })
  instagram: string;

  @Column({ nullable: true })
  x: string;

  @Column({ nullable: true })
  youtube: string;

  @Column({ nullable: true })
  tiktok: string;

  @Column({ nullable: true })
  linkedin: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  github: string;

  @Column({ nullable: true })
  website: string;

  @Column({ default: -1 })
  facebook_order: number;

  @Column({ default: -1 })
  instagram_order: number;

  @Column({ default: -1 })
  x_order: number;

  @Column({ default: -1 })
  youtube_order: number;

  @Column({ default: -1 })
  tiktok_order: number;

  @Column({ default: -1 })
  linkedin_order: number;

  @Column({ default: -1 })
  discord_order: number;

  @Column({ default: -1 })
  github_order: number;

  @Column({ default: -1 })
  website_order: number;

  @UpdateDateColumn()
  updated_at: Date;
}