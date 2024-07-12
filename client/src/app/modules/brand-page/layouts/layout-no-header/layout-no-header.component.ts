import { Component, Input } from '@angular/core';
import { Brand, BrandDraft, SocialIconPosition } from 'src/app/core/models';

@Component({
  selector: 'app-layout-no-header',
  templateUrl: './layout-no-header.component.html',
  styleUrls: ['./layout-no-header.component.scss']
})
export class LayoutNoHeaderComponent {
  readonly defaultBrandLogo = "/assets/images/default-brand-logo.png";
  readonly SocialIconPosition = SocialIconPosition;

  @Input() brand!: Brand | BrandDraft;
}
