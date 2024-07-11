import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { QrCodeDialogDto } from 'src/app/core/dtos';
import { UserSetting } from 'src/app/core/models';
import { UserSettingService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.scss'],
})
export class QrCodeDialogComponent {
  screenWidth = window.screen.width;

  shortenedLink = "";
  userSetting: Partial<UserSetting> = {};
  fetchedUserSetting = true;

  constructor(
    private userSettingService: UserSettingService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: QrCodeDialogDto
  ) {
    this.shortenedLink = data.url.client + (data.url.custom_back_half || data.url.back_half);
    if (data.fetchUserSettings) {
      this.fetchedUserSetting = false;
      this.userSettingService.getUserSetting().pipe(
        tap(settings => this.userSetting = settings),
        finalize(() => this.fetchedUserSetting = true),
        untilDestroyed(this)
      ).subscribe();
    } else {
      Object.assign(this.userSetting, this.data);
    }
  }

  saveQRImage(element: any) {
    const parentElement = element.qrcElement.nativeElement
      .querySelector("canvas")
      .toDataURL("image/png");

    if (parentElement) {
      // converts base 64 encoded image to blobData
      let blobData = this.convertBase64ToBlob(parentElement)
      // saves as image
      const blob = new Blob([blobData], { type: "image/png" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url;
      // name of the file
      link.download = this.data.url.title;
      link.click();

      // Show notification that download was successful
      this.snackbar.open("Downloaded QR Code", "x", {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top"
      })
    } else {
      this.snackbar.open("Failed when download QR Code", "x", {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top"
      });
    }
  }

  private convertBase64ToBlob(Base64Image: string) {
    // split into two parts
    const parts = Base64Image.split(";base64,")
    // hold the content type
    const imageType = parts[0].split(":")[1]
    // decode base64 string
    const decodedData = window.atob(parts[1])
    // create unit8array of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length)
    // insert all character code into uint8array
    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i)
    }
    // return blob image after conversion
    return new Blob([uInt8Array], { type: imageType })
  }
}
