import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { BrandDraft } from "./brand-draft.entity";
import { BrandSocialPlatformsBase } from "./brand-base";

@Entity()
export class BrandSocialPlatformsDraft extends BrandSocialPlatformsBase {
  @PrimaryColumn("uuid")
  brand_id: string;

  @OneToOne(() => BrandDraft, brandDraft => brandDraft.social_platforms)
  @JoinColumn({ name: "brand_id" })
  brand_draft: BrandDraft;
}