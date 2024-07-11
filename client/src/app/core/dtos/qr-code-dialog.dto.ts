import { ExtendedUrl } from "../models";

export interface QrCodeDialogDto {
  url: ExtendedUrl;
  fetchUserSettings: boolean;
  qr_code_background_color: string;
  qr_code_foreground_color: string;
  qr_code_show_logo: boolean;
  qr_code_logo_url: string;
}
