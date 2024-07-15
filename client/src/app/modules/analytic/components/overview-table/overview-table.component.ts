import { Component, Input } from '@angular/core';
import { Brand, ExtendedUrl, Tag } from 'src/app/core/models';

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
  @Input() tags: Tag[] = [];
  @Input() brand?: Brand;
}
