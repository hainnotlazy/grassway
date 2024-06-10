import { Component, Input } from '@angular/core';
import { Tag } from 'src/app/core/models/tag.model';
import { Url } from 'src/app/core/models/url.model';
import { ExtendedUrl } from 'src/app/modules/url/components/link/link.component';

@Component({
  selector: 'app-overview-table',
  templateUrl: './overview-table.component.html',
  styleUrls: ['./overview-table.component.scss'],
  host: {
    class: "block"
  }
})
export class OverviewTableComponent {
  @Input() url!: ExtendedUrl;
  @Input() tags!: Tag[];
}
