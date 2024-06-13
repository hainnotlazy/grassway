import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserProfile } from '../interfaces/manage-account.interface';
import { ResendVerificationCodeResponse } from '../interfaces/verify-email-response.interface';
import { noop, tap } from 'rxjs';
import { removeAccessToken } from '../helpers/local-storage.helper';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  /**
   * Describe: Get current user information
  */
  getCurrentUser() {
    return this.httpClient.get<User>("api/users").pipe(
      tap(
        noop,
        (error) => {
          if (error.error.statusCode === 401) {
            removeAccessToken();
            this.router.navigate(["/"]);
          }
        }
      )
    );
  }

  /**
   * Describe: Update current user information
  */
  updateCurrentUser(userProfile: UserProfile) {
    let { dob } = userProfile;
    const formData = new FormData();

    for (const field of ["fullname", "bio", "gender", "avatar", "phone"]) {
      if (userProfile[field]) {
        formData.append(field, userProfile[field]);
      }
    }

    if (dob) {
      dob = new Date(dob);
      dob.setMinutes(dob.getMinutes() - dob.getTimezoneOffset());

      if (!isNaN(dob.getTime())) {
        formData.append("dob", dob.toISOString().split("T")[0]);
      }
    }

    return this.httpClient.put<User>("api/users", formData);
  }

  /**
   * Describe: Resend email verification code
  */
  resendVerificationCode() {
    return this.httpClient.post<ResendVerificationCodeResponse>("api/users/resend-verification-code", null);
  }

  /**
   * Describe: Verify email
  */
  verifyEmail(code: string) {
    return this.httpClient.put<void>("api/users/verify-email", {
      code
    });
  }

  /**
   * Describe: Change password
  */
  changePassword(password: string, newPassword: string) {
    return this.httpClient.put<void>("api/users/change-password", {
      password,
      newPassword
    });
  }
}
