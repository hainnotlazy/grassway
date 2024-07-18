import { Component, Input } from '@angular/core';
import { ExtendedUrl } from 'src/app/core/models';

@Component({
  selector: 'app-statics-chart',
  templateUrl: './statics-chart.component.html',
  styleUrls: ['./statics-chart.component.scss'],
  host: {
    class: "block dark:p-4 dark:rounded-md dark:shadow-md dark:bg-neutral-200"
  }
})
export class StaticsChartComponent {
  @Input() url!: ExtendedUrl;
}
