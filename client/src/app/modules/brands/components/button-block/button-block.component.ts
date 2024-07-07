import { Component, Input } from '@angular/core';
import { BrandBlockDraft } from 'src/app/core/models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-button-block',
  templateUrl: './button-block.component.html',
  styleUrls: ['./button-block.component.scss'],
  host: {
    class: "block"
  }
})
export class ButtonBlockComponent {
  client = `${environment.client}/l/`;

  @Input() block!: BrandBlockDraft;
}
