import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) { }

  login(username: string, password: string) {
    return this.httpClient.post<AuthResponse>(`api/auth/login?ref=${this.getCookie('ref')}`, { username, password });
  }

  register(username: string, password: string, email?: string) {
    return this.httpClient.post<AuthResponse>(`api/auth/register?ref=${this.getCookie('ref')}`, {
      username,
      password,
      email: email || undefined,
    })
  }

  logout() {
    return this.httpClient.post("api/auth/logout", null);
  }

  private getCookie(cookieName: string) {
    return this.cookieService.get(cookieName);
  }
}
