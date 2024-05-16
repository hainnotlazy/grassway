import { Component } from '@angular/core';
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
  navigateToAuthenticationPage(provider: "google" | "github" | "facebook" | "twitter") {
    window.location.href = `${environment.server}/api/auth/${provider}`
  }
}
