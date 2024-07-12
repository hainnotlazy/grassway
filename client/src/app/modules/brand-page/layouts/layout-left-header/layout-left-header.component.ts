import { Component, Input } from '@angular/core';
import { Brand, BrandDraft, SocialIconPosition } from 'src/app/core/models';

@Component({
  selector: 'app-layout-left-header',
  templateUrl: './layout-left-header.component.html',
  styleUrls: ['./layout-left-header.component.scss']
})
export class LayoutLeftHeaderComponent {
  readonly SocialIconPosition = SocialIconPosition;

  @Input() brand!: Brand | BrandDraft;
}
