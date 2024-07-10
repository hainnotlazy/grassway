import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { take, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Brand } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-qr-code-form',
  templateUrl: './qr-code-form.component.html',
  styleUrls: ['./qr-code-form.component.scss']
})
export class QrCodeFormComponent {
  backgroundColor = '#000000';
  foregroundColor = '#ffffff';
  currentBrand!: Brand;
  isProcessing = false;
  formError = "";
  logoUrl = "./assets/images/grassway-logo.png";

  settingsForm = new FormGroup({
    backgroundColor: new FormControl('', [
      Validators.minLength(7),
      Validators.maxLength(7),
    ]),
    foregroundColor: new FormControl('', [
      Validators.minLength(7),
      Validators.maxLength(7),
    ]),
  });

  constructor(
    private brandsService: BrandsService,
    private snackbar: MatSnackBar
  ) {
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

    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => {
        this.currentBrand = brand;
        this.settingsForm.patchValue({
          backgroundColor: brand.qr_code_background_color,
          foregroundColor: brand.qr_code_foreground_color,
        })
        if (brand.logo) {
          this.logoUrl = `${environment.client}/${brand.logo}`;
        }
      }),
    ).subscribe();
  }

  onSubmit() {
    if (this.settingsForm.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);
      this.brandsService.updateQrCodeSettings(this.currentBrand.id, {
        qr_code_background_color: this.settingsForm.controls.backgroundColor.value as string,
        qr_code_foreground_color: this.settingsForm.controls.foregroundColor.value as string,
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
