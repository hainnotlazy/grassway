import { Component, Input } from '@angular/core';
import { ExtendedUrl } from 'src/app/modules/url/components/link/link.component';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  host: {
    class: "block"
  }
})
export class LinkComponent {
  @Input() url!: ExtendedUrl;
}
