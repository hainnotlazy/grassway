import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { BrandBlockBase } from "./brand-base";
import { Brand } from "./brand.entity";
import { Url } from "./url.entity";

@Entity()
export class BrandBlock extends BrandBlockBase {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn("uuid")
  brand_id: string;

  @ManyToOne(() => Brand, brand => brand.blocks)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @ManyToOne(() => Url, url => url.blocks, { nullable: true })
  url: Url;
}