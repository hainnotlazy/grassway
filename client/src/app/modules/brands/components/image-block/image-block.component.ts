import { Component, Input } from '@angular/core';
import { BrandBlockDraft } from 'src/app/core/models';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
  host: {
    class: "block"
  }
})
export class ImageBlockComponent {
  @Input() block!: BrandBlockDraft;
}
