import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from 'src/app/core/validators/form.validator';
import { UrlsService } from 'src/app/core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { ValidationMessage, shortenUrlRequirements } from 'src/app/core/forms';
import { ErrorResponse } from 'src/app/core/interfaces';

@UntilDestroy()
@Component({
  selector: 'shorten-url-page',
  templateUrl: './shorten-url.component.html',
  styleUrls: ['./shorten-url.component.scss']
})
export class ShortenUrlPage {
  formError = "";
  hidePassword = true;
  isProcessing = false;

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
  })

  constructor(
    private urlsService: UrlsService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit() {
    if (this.form.valid && !this.isProcessing) {
      this.isProcessing = true;

      this.urlsService.shortenUrl({
        origin_url: this.form.get("originUrl")?.value as string,
        title: this.form.get("title")?.value as string,
        description: this.form.get("description")?.value as string,
        custom_back_half: this.form.get("customBackHalf")?.value as string,
        password: this.form.get("password")?.value as string
      }).pipe(
        tap(() => {
          this.router.navigate(["/u/links"]);
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
