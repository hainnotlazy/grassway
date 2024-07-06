import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, take, tap } from 'rxjs';
import { shortenUrlRequirements, ValidationMessage } from 'src/app/core/forms';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces';
import { BrandsService, UrlsService } from 'src/app/core/services';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
@Component({
  selector: 'app-create-link-dialog',
  templateUrl: './create-link-dialog.component.html',
  styleUrls: ['./create-link-dialog.component.scss']
})
export class CreateLinkDialogComponent {
  formError = "";
  hidePassword = true;
  isProcessing = false;
  brandId!: string;

  // Form validation messages
  originUrlValidationMessages: ValidationMessage = shortenUrlRequirements.originUrl.validationMsg;
  customBackHalfValidationMessages: ValidationMessage = shortenUrlRequirements.customBackHalf.validationMsg;

  getObjectKeys = getObjectKeys;

  form = new FormGroup({
    originUrl: new FormControl("", [
      Validators.required,
      FormValidator.validUrl
    ]),
    title: new FormControl(""),
    description: new FormControl(""),
    customBackHalf: new FormControl("", [], FormValidator.customBackHalfExisted(this.urlsService)),
    password: new FormControl("")
  });

  constructor(
    private urlsService: UrlsService,
    private brandsService: BrandsService,
    private dialogRef: MatDialogRef<CreateLinkDialogComponent>,
    private snackbar: MatSnackBar,
  ) {
    this.brandsService.currentBrand$.pipe(
      tap(brand => this.brandId = brand.id),
      take(1),
      untilDestroyed(this)
    ).subscribe();
  }

  onSubmit() {
    if (this.form.valid && !this.isProcessing) {
      this.isProcessing = true;

      this.brandsService.createLink(this.brandId, {
        origin_url: this.form.get("originUrl")?.value as string,
        title: this.form.get("title")?.value as string,
        description: this.form.get("description")?.value as string,
        custom_back_half: this.form.get("customBackHalf")?.value as string,
        password: this.form.get("password")?.value as string
      }).pipe(
        tap(() => {
          this.handleShortenSuccess();
        }, (error) => {
          this.handleShortenFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe()
    }
  }

  private handleShortenSuccess() {
    this.snackbar.open("Shortened new link", "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
    this.dialogRef.close();
  }

  private handleShortenFail(error: any) {
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
