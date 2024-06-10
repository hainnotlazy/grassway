import { Component, Input } from '@angular/core';
import { ExtendedUrl } from 'src/app/modules/url/components/link/link.component';

@Component({
  selector: 'app-statics-chart',
  templateUrl: './statics-chart.component.html',
  styleUrls: ['./statics-chart.component.scss'],
  host: {
    class: "block"
  }
})
export class StaticsChartComponent {
  @Input() url!: ExtendedUrl;
}
