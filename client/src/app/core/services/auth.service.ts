import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../interfaces/auth-response.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private httpClient: HttpClient
  ) { }

  login(username: string, password: string) {
    return this.httpClient.post<AuthResponse>("api/auth/login", { username, password });
  }

  register(username: string, password: string, email?: string) {
    return this.httpClient.post<AuthResponse>("api/auth/register", {
      username,
      password,
      email: email || undefined,
    })
  }

  logout() {
    return this.httpClient.post("api/auth/logout", null);
  }
}
