import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth-response.interface';
import { RefService } from './ref.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private refService: RefService
  ) { }

  /**
   * Describe: Login
  */
  login(username: string, password: string) {
    return this.httpClient.post<AuthResponse>(`api/auth/login`, { username, password }).pipe(
      tap(
        () => {
          // Login success => remove ref links (for details on RefService)
          this.refService.removeRefLinks();
        }
      )
    );
  }

  /**
   * Describe: Register
  */
  register(username: string, password: string, email?: string) {
    // Get ref links
    const refLinks = this.refService.getRefLinks();
    const refLinksQuery =
      refLinks.length > 0
      ? refLinks.map(linkId => `ref_links=${linkId}`).join("&")
      : "";

    return this.httpClient.post<AuthResponse>(`api/auth/register?${refLinksQuery}`, {
      username,
      password,
      email: email || undefined,
    }).pipe(
      tap(
        () => {
          // Authenticated success => remove ref links (for details on RefService)
          this.refService.removeRefLinks();
        }
      )
    )
  }

  /**
   * Describe: Logout
  */
  logout() {
    return this.httpClient.post("api/auth/logout", null);
  }
}
