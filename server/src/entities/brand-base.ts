import { BeforeInsert, BeforeUpdate, Column, UpdateDateColumn } from "typeorm";
import { BlockImageRatio, BlockShadow, BlockShape, BlockType, BrandFont, BrandLayout, SocialIconPosition, SocialIconStyle } from "./brand.enum";

export abstract class BrandBase {
  @Column({ length: 80 })
  title: string;

  @Column({ nullable: true, length: 100 })
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

  @Column({
    type: "enum",
    enum: BrandLayout,
    default: BrandLayout.NO_HEADER
  })
  layout: BrandLayout;

  @Column({
    default: "#000000",
    length: 7
  })
  header_color: string;

  @Column({
    default: "#ffffff",
    length: 7
  })
  background_color: string;

  @Column({
    default: "#ffffff",
    length: 7
  })
  title_color: string;

  @Column({
    default: "#000000",
    length: 7
  })
  description_color: string;

  @Column({
    type: "enum",
    enum: BlockShape,
    default: BlockShape.ROUNDED_NO_BORDER
  })
  block_shape: BlockShape;

  @Column({
    type: "enum",
    enum: BlockShadow,
    default: BlockShadow.NO_SHADOW
  })
  block_shadow: BlockShadow;

  @Column({
    default: "#000000",
    length: 7
  })
  block_color: string;

  @Column({
    default: "#ffffff",
    length: 7
  })
  block_text_color: string;

  @Column({
    type: "enum",
    enum: BrandFont,
    default: BrandFont.KARLA
  })
  font: BrandFont;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  handleBeforeInsert() {
    this.prefix = this.prefix.toLowerCase();
  }

  @BeforeUpdate()
  handleBeforeUpdate() {
    this.prefix = this.prefix.toLowerCase();
  }
}

export abstract class BrandSocialPlatformsBase {
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

export abstract class BrandBlockBase {
  @Column({
    type: "enum",
    enum: BlockType,
    default: BlockType.BUTTON
  })
  type: BlockType;

  @Column({ length: 80 })
  title: string;

  @Column({ nullable: true, length: 150 })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: "enum",
    enum: BlockImageRatio,
    default: BlockImageRatio.RATIO_3_2
  })
  image_ratio: BlockImageRatio;

  @Column({ default: -1 })
  order: number;

  @Column({ nullable: true })
  youtube_url: string;

  @UpdateDateColumn()
  updated_at: Date;
}