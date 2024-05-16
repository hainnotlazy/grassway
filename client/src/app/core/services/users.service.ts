import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserProfile } from '../interfaces/manage-account.interface';
import { ResendVerificationCodeResponse } from '../interfaces/verify-email-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getCurrentUser() {
    return this.httpClient.get<User>("api/users");
  }

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

  resendVerificationCode() {
    return this.httpClient.post<ResendVerificationCodeResponse>("api/users/resend-verification-code", null);
  }

  verifyEmail(code: string) {
    return this.httpClient.put<void>("api/users/verify-email", {
      code
    });
  }
}
