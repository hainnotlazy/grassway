import { Component, Input } from '@angular/core';
import { BrandBlockDraft } from 'src/app/core/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
  host: {
    class: "block"
  }
})
export class ImageBlockComponent {
  client = `${environment.client}/l/`;

  @Input() block!: BrandBlockDraft;
}
