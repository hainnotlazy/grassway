import { Component } from '@angular/core';
import { RefService } from 'src/app/core/services/ref.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-oauth',
  templateUrl: './login-oauth.component.html',
  styleUrls: ['./login-oauth.component.scss'],
  host: {
    class: 'block'
  }
})
export class LoginOauthComponent {
  constructor(
    private refService: RefService
  ) {}

  navigateToAuthenticationPage(provider: "google" | "github" | "facebook" | "twitter") {
    const refLinks = this.refService.getRefLinks();
    const refLinksQuery =
      refLinks.length > 0
      ? refLinks.map(linkId => `refLinks=${linkId}`).join("&")
      : "";

    window.location.href = `${environment.server}/api/auth/${provider}?${refLinksQuery}`
  }
}
