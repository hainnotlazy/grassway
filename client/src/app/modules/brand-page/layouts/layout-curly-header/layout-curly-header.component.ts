import { Component, Input } from '@angular/core';
import { BrandBase } from 'src/app/core/models';

@Component({
  selector: 'app-layout-curly-header',
  templateUrl: './layout-curly-header.component.html',
  styleUrls: ['./layout-curly-header.component.scss']
})
export class LayoutCurlyHeaderComponent {
  @Input() brand!: BrandBase;
}
