import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { BrandBlockBase } from "./brand-base";
import { Brand } from "./brand.entity";

@Entity()
export class BrandBlock extends BrandBlockBase {
  @PrimaryColumn()
  id: number;

  @PrimaryColumn("uuid")
  brand_id: string;

  @ManyToOne(() => Brand, brand => brand.blocks)
  @JoinColumn({ name: "brand_id" })
  brand: Brand;
}