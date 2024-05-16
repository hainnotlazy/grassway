import { Component } from '@angular/core';
import { UsersService } from 'src/app/core/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.scss']
})
export class LinkAccountComponent {
  currentUser$ = this.usersService.getCurrentUser();

  constructor(
    private usersService: UsersService
  ) {}

  linkAccount(
    provider: "google" | "github" | "facebook" | "twitter",
    userId: number
  ) {
    window.location.href = `${environment.server}/api/auth/${provider}?userId=${userId}`;
  }
}
