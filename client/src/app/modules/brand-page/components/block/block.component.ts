import { Component, Input } from '@angular/core';
import { BlockImageRatio, BlockShadow, BlockShape, BlockType, BrandBlockBase } from 'src/app/core/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss'],
  host: {
    class: "block"
  }
})
export class BlockComponent {
  readonly client = environment.client;
  readonly BlockType = BlockType;
  readonly BlockShape = BlockShape;
  readonly BlockShadow = BlockShadow;
  readonly BlockImageRatio = BlockImageRatio;

  @Input() block!: BrandBlockBase;
  @Input() blockShape!: BlockShape;
  @Input() blockShadow!: BlockShadow;
  @Input() descriptionColor!: string;
  @Input() blockColor!: string;
  @Input() blockTextColor!: string;
}
