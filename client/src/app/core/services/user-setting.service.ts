import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserSetting } from '../models';
import { UpdateUserSettingsDto } from '../dtos';

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
  updateUserSetting(updateUserSettingsDto: UpdateUserSettingsDto) {
    const formData = new FormData();

    if (updateUserSettingsDto.qrCodeBackgroundColor) {
      formData.append("qr_code_background_color", updateUserSettingsDto.qrCodeBackgroundColor);
    }
    if (updateUserSettingsDto.qrCodeForegroundColor) {
      formData.append("qr_code_foreground_color", updateUserSettingsDto.qrCodeForegroundColor);
    }
    if (updateUserSettingsDto.logo) {
      formData.append("logo", updateUserSettingsDto.logo);
      }
    formData.append("qr_code_show_logo", updateUserSettingsDto.qrCodeShowLogo.toString());

    return this.httpClient.put<UserSetting>(`api/settings/user`, formData);
  }
}
