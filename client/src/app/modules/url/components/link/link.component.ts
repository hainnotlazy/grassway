import { Component, Input } from '@angular/core';
import { Url } from 'src/app/core/models/url.model';

interface ExtendedUrl extends Url {
  client: string;
}
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
