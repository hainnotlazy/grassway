import { Component, Input } from '@angular/core';
import { BrandBase } from 'src/app/core/models/brand-base.model';

@Component({
  selector: 'app-layout-center-header',
  templateUrl: './layout-center-header.component.html',
  styleUrls: ['./layout-center-header.component.scss']
})
export class LayoutCenterHeaderComponent {
  @Input() brand!: BrandBase;
}
