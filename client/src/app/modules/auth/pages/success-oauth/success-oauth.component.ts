import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setAccessToken } from 'src/app/core/helpers/local-storage.helper';

@Component({
  selector: 'success-oauth-page',
  templateUrl: './success-oauth.component.html',
  styleUrls: ['./success-oauth.component.scss']
})
export class SuccessOauthPage implements OnInit {
  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    const accessToken = this.getCookie('access_token');

    if (accessToken) {
      setAccessToken(accessToken);
      this.removeCookie('access_token');
      this.router.navigate(["/u/links"]);
    } else {
      this.router.navigate(["/"]);
    }
  }

  private getCookie(name: string): string {
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(name))
      ?.split('=')[1];
    return cookieValue || '';
  }

  private removeCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
