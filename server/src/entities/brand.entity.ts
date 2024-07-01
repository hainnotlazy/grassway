import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BrandSocialPlatforms } from "./brand-social-platforms.entity";
import { BrandMember } from "./brand-member.entity";
import { BrandDraft } from "./brand-draft.entity";
import { BlockShadow, BlockShape, BrandFont, BrandLayout } from "./brand.enum";

@Entity()
export class Brand {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => BrandSocialPlatforms, social_platforms => social_platforms.brand)
  social_platforms: BrandSocialPlatforms;

  @OneToMany(() => BrandMember, member => member.brand)
  members: BrandMember[];

  @OneToOne(() => BrandDraft, draft => draft.brand)
  draft: BrandDraft;

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

  @CreateDateColumn()
  created_at: Date;

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