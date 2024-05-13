import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserProfile } from '../interfaces/manage-account.interface';

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

    return this.httpClient.put<User>("api/users/update-profile", formData);
  }
}
