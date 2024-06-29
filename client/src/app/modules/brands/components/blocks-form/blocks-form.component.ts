import { getObjectValues } from 'src/app/core/helpers/utils';
import { BlockShape, BlockShadow } from "../../../../core/models/brand.enum";
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-blocks-form',
  templateUrl: './blocks-form.component.html',
  styleUrls: ['./blocks-form.component.scss']
})
export class BlocksFormComponent {
  @Input() blockShapeControl!: FormControl;
  @Input() blockShadowControl!: FormControl;
  @Input() blockColorControl!: FormControl;
  @Input() blockTextColorControl!: FormControl;

  readonly BlockShape = BlockShape;
  readonly BlockShadow = BlockShadow;
  readonly getObjectValues = getObjectValues;
}
