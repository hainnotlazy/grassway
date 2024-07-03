import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { BrandSocialPlatformsDraft } from "./brand-social-platforms-draft.entity";
import { BrandBase } from "./brand-base";
import { BrandBlockDraft } from "./brand-block-draft.entity";

@Entity()
export class BrandDraft extends BrandBase {
  @PrimaryColumn("uuid")
  brand_id: string;

  @OneToOne(() => Brand, brand => brand.draft)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @OneToMany(() => BrandBlockDraft, block => block.brand_draft)
  blocks: BrandBlockDraft[];

  @OneToOne(() => BrandSocialPlatformsDraft, social_platforms => social_platforms.brand_draft)
  social_platforms: BrandSocialPlatformsDraft;
}