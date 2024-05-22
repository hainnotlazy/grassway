import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-section',
  templateUrl: './loading-section.component.html',
  styleUrls: ['./loading-section.component.scss'],
  host: {
    class: "block"
  }
})
export class LoadingSectionComponent {
  @Input() currentPage!: number;
  @Input() totalPage!: number;
}
