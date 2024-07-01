import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { UserSettingService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-qr-code-form',
  templateUrl: './qr-code-form.component.html',
  styleUrls: ['./qr-code-form.component.scss'],
  host: { class: 'block' },
})
export class QrCodeFormComponent implements OnInit {
  backgroundColor = '#000000';
  foregroundColor = '#ffffff';
  loadedUserSetting = false;
  isProcessing = false;
  formError = "";
  logoUrl = "./assets/images/grassway-logo.png";

  @ViewChild("logoInput") logoInput?: ElementRef;

  settingsForm = new FormGroup({
    backgroundColor: new FormControl('', [
      Validators.minLength(7),
      Validators.maxLength(7),
    ]),
    foregroundColor: new FormControl('', [
      Validators.minLength(7),
      Validators.maxLength(7),
    ]),
    showLogo: new FormControl(true),
    logo: new FormControl(''),
  });

  constructor(
    private userSettingService: UserSettingService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userSettingService.getUserSetting().pipe(
      tap((userSetting) => {
        this.settingsForm.patchValue({
          backgroundColor: userSetting.qr_code_background_color,
          foregroundColor: userSetting.qr_code_foreground_color,
          showLogo: userSetting.qr_code_show_logo,
        });
        if (userSetting.qr_code_logo_url) {
          this.logoUrl = userSetting.qr_code_logo_url;
        }
      }),
      tap(() => {
        this.loadedUserSetting = changeStatus(this.loadedUserSetting);
      }),
      untilDestroyed(this)
    ).subscribe();

    // Watch value change of colors
    this.settingsForm.controls.backgroundColor.valueChanges.pipe(
      tap(color => {
        if (color?.length === 7) {
          this.backgroundColor = color;
        }
      }),
      untilDestroyed(this)
    ).subscribe();

    this.settingsForm.controls.foregroundColor.valueChanges.pipe(
      tap(color => {
        if (color?.length === 7) {
          this.foregroundColor = color;
        }
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onSubmit() {
    if (this.settingsForm.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);
      this.userSettingService.updateUserSetting({
        qrCodeBackgroundColor: this.settingsForm.controls.backgroundColor.value as string,
        qrCodeForegroundColor: this.settingsForm.controls.foregroundColor.value as string,
        qrCodeShowLogo: this.settingsForm.controls.showLogo.value as boolean,
        logo: this.settingsForm.controls.logo.value
      }).pipe(
        tap(() => {
          this.handleUpdateSettingSuccess();
        }, error => {
          this.handleUpdateSettingFailed(error);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  onLogoChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.settingsForm.patchValue({ logo: file as any });
      this.settingsForm.controls.logo.markAsDirty();
    }
  }

  openSelectLogo() {
    if (this.logoInput) {
      this.logoInput.nativeElement.click();
    }
  }

  private handleUpdateSettingSuccess() {
    this.isProcessing = changeStatus(this.isProcessing);
    this.formError = "";
    this.snackbar.open('Update settings successfully', 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    })
  }

  private handleUpdateSettingFailed(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.formError = errorMessage;
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
