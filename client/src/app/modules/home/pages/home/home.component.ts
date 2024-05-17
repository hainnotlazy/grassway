import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { shortenUrlRequirements } from 'src/app/core/constants/form-requirement.const';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';
import { FormValidator } from 'src/app/core/validators/form.validator';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    class: 'flex flex-col justify-center gap-8'
  }
})
export class HomePage {
  shortenUrl = "";
  formError = "";
  isProcessing = false;

  // Save shorten urls (just prevent user from entering same url)
  cachedUrls: Url[] = [];

  // Form validation messages
  urlValidationMessages: ValidationMessage = shortenUrlRequirements.url.validationMsg;

  urlControl = new FormControl("", [
    Validators.required,
    FormValidator.validUrl
  ])

  getObjectKeys = getObjectKeys;

  constructor(
    private urlsService: UrlsService,
    private snackbar: MatSnackBar
  ) {}

  onPressEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.isProcessing) {
      this.onShortenUrl();
    }
  }

  onShortenUrl() {
    if (this.urlControl.valid) {
      this.isProcessing = true;

      // If url has been shortened
      const cachedUrl = this.isShortened(this.urlControl.value as string);
      if (cachedUrl) {
        this.isProcessing = changeStatus(this.isProcessing);
        return this.handleShortenSuccess(cachedUrl, false);
      }

      this.urlsService.shortenUrl(this.urlControl.value as string).pipe(
        tap(data => {
          this.handleShortenSuccess(data);
        }, (error) => {
          this.handleShortenFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe()
    } else {
      const controlErrors = this.urlControl.errors;
      this.formError = this.urlValidationMessages[getObjectKeys(controlErrors)[0]];
    }
  }

  private handleShortenSuccess(url: Url, saveCache: boolean = true) {
    if (saveCache) {
      this.cachedUrls.push(url);
    }
    this.formError = "";
    this.shortenUrl = `${environment.server}/${url.back_half}`;
    this.snackbar.open("Shorten url successfully", "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
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

  private isShortened(url: string) {
    return this.cachedUrls.find(cachedUrl => cachedUrl.origin_url === url);
  }
}
