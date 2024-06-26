import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExtendedUrl } from 'src/app/core/models';
import { UserSettingService } from 'src/app/core/services';

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent {
  screenWidth = window.screen.width;

  userSetting$ = this.userSettingService.getUserSetting();

  constructor(
    private userSettingService: UserSettingService,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: ExtendedUrl
  ) {}

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
      link.download = this.data.title;
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
