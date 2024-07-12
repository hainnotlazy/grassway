import { Component, Input } from '@angular/core';
import { Brand, BrandDraft, SocialIconPosition } from 'src/app/core/models';

@Component({
  selector: 'app-layout-curly-header',
  templateUrl: './layout-curly-header.component.html',
  styleUrls: ['./layout-curly-header.component.scss']
})
export class LayoutCurlyHeaderComponent {
  readonly defaultBrandLogo = "/assets/images/default-brand-logo.jpg";
  readonly SocialIconPosition = SocialIconPosition;

  @Input() brand!: Brand | BrandDraft;
}
