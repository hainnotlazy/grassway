import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getCurrentUser() {
    return this.httpClient.get<User>("api/users/my-profile");
  }
}
