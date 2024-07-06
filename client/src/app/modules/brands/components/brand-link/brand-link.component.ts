import { Component, Input } from '@angular/core';
import { ExtendedUrl } from 'src/app/core/models';

@Component({
  selector: 'app-brand-link',
  templateUrl: './brand-link.component.html',
  styleUrls: ['./brand-link.component.scss'],
  host: {
    class: "block"
  }
})
export class BrandLinkComponent {
  @Input() link!: ExtendedUrl;
}
