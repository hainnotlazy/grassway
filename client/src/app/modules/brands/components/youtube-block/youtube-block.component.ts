import { Component, Input } from '@angular/core';
import { BrandBlockDraft } from 'src/app/core/models';

@Component({
  selector: 'app-youtube-block',
  templateUrl: './youtube-block.component.html',
  styleUrls: ['./youtube-block.component.scss'],
  host: {
    class: "block"
  }
})
export class YoutubeBlockComponent {
  @Input() block!: BrandBlockDraft;
}
