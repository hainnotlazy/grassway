import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { BrandSocialPlatforms } from "./brand-social-platforms.entity";
import { BrandMember } from "./brand-member.entity";
import { BrandDraft } from "./brand-draft.entity";
import { BrandBase } from "./brand-base";
import { BrandBlock } from "./brand-block.entity";
import { Url } from "./url.entity";

@Entity()
export class Brand extends BrandBase {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToMany(() => Url, url => url.brand)
  urls: Url[];

  @OneToOne(() => BrandSocialPlatforms, social_platforms => social_platforms.brand)
  social_platforms: BrandSocialPlatforms;

  @OneToMany(() => BrandMember, member => member.brand)
  members: BrandMember[];

  @OneToMany(() => BrandBlock, block => block.brand)
  blocks: BrandBlock[];

  @OneToOne(() => BrandDraft, draft => draft.brand)
  draft: BrandDraft;

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
}