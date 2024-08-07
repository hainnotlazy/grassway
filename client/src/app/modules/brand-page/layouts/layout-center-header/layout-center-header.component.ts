import { Component, Input } from '@angular/core';
import { Brand, BrandDraft, SocialIconPosition } from 'src/app/core/models';

@Component({
  selector: 'app-layout-center-header',
  templateUrl: './layout-center-header.component.html',
  styleUrls: ['./layout-center-header.component.scss']
})
export class LayoutCenterHeaderComponent {
  readonly defaultBrandLogo = "/assets/images/default-brand-logo.png";
  readonly SocialIconPosition = SocialIconPosition;

  @Input() brand!: Brand | BrandDraft;
}
