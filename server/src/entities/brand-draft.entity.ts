import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { BrandSocialPlatformsDraft } from "./brand-social-platforms-draft.entity";
import { BlockShadow, BlockShape, BrandFont, BrandLayout } from "./brand.enum";

@Entity()
export class BrandDraft {
  @PrimaryColumn("uuid")
  brand_id: string;

  @OneToOne(() => Brand, brand => brand.draft)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @OneToOne(() => BrandSocialPlatformsDraft, social_platforms => social_platforms.brand)
  social_platforms: BrandSocialPlatformsDraft;

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
    default: "#000000",
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
    default: "#ffffff",
    length: 7
  })
  block_color: string;

  @Column({
    default: "#000000",
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