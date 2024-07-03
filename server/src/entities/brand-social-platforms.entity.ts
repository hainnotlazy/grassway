import { Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Brand } from "./brand.entity";
import { BrandSocialPlatformsBase } from "./brand-base";

@Entity()
export class BrandSocialPlatforms extends BrandSocialPlatformsBase {
  @PrimaryColumn("uuid")
  brand_id: string;

  @OneToOne(() => Brand, brand => brand.social_platforms)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;
}