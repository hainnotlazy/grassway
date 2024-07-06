import { Component, Input } from '@angular/core';
import { BrandBlockDraft } from 'src/app/core/models';

@Component({
  selector: 'app-button-block',
  templateUrl: './button-block.component.html',
  styleUrls: ['./button-block.component.scss'],
  host: {
    class: "block"
  }
})
export class ButtonBlockComponent {
  @Input() block!: BrandBlockDraft;
}
