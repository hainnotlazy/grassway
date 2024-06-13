import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSetting } from '../models/user-setting.model';
import { UpdateUserSetting } from '../interfaces/user-setting.interface';

@Injectable({
  providedIn: 'root'
})
export class UserSettingService {
  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * Describe: Get user setting
  */
  getUserSetting() {
    return this.httpClient.get<UserSetting>(`api/settings/user`);
  }

  /**
   * Describe: Update user setting
  */
  updateUserSetting(updateUserSetting: UpdateUserSetting) {
    const formData = new FormData();

    if (updateUserSetting.qrCodeBackgroundColor) {
      formData.append("qr_code_background_color", updateUserSetting.qrCodeBackgroundColor);
    }
    if (updateUserSetting.qrCodeForegroundColor) {
      formData.append("qr_code_foreground_color", updateUserSetting.qrCodeForegroundColor);
    }
    if (updateUserSetting.logo) {
      formData.append("logo", updateUserSetting.logo);
      }
    formData.append("qr_code_show_logo", updateUserSetting.qrCodeShowLogo.toString());

    return this.httpClient.put<UserSetting>(`api/settings/user`, formData);
  }
}
