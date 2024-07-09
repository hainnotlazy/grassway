import { Component, Input } from '@angular/core';
import { Brand, BrandDraft } from 'src/app/core/models';

@Component({
  selector: 'app-layout-center-header',
  templateUrl: './layout-center-header.component.html',
  styleUrls: ['./layout-center-header.component.scss']
})
export class LayoutCenterHeaderComponent {
  @Input() brand!: Brand | BrandDraft;
}
