import { Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { BrandBlockBase } from './brand-base';
import { BrandDraft } from './brand-draft.entity';
import { Url } from './url.entity';

@Entity()
export class BrandBlockDraft extends BrandBlockBase {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn("uuid")
  brand_id: string;

  @ManyToOne(() => BrandDraft, brand => brand.blocks)
  @JoinColumn({ name: "brand_id" })
  brand_draft: BrandDraft;

  @ManyToOne(() => Url, url => url.blocks_draft, { nullable: true })
  url: Url;
}