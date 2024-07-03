import { Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { BrandBlockBase } from './brand-base';
import { BrandDraft } from './brand-draft.entity';

@Entity()
export class BrandBlockDraft extends BrandBlockBase {
  @PrimaryColumn()
  id: number;

  @PrimaryColumn('uuid')
  brand_id: string;

  @OneToMany(() => BrandDraft, brand => brand.blocks)
  @JoinColumn({ name: 'brand_id' })
  brand_draft: BrandDraft;
}