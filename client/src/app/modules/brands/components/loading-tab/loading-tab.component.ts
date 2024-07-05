import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-tab',
  templateUrl: './loading-tab.component.html',
  styleUrls: ['./loading-tab.component.scss'],
  host: {
    class: "h-80 block"
  }
})
export class LoadingTabComponent {
  @Input() description!: string;
}
