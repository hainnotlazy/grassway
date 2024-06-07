import { RefService } from './../../../../core/services/ref.service';
import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { shortenUrlRequirements } from 'src/app/core/constants/url-form-requirement.const';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';
import { FormValidator } from 'src/app/core/validators/form.validator';
import { environment } from 'src/environments/environment';
import { RemindDialogComponent } from '../remind-dialog/remind-dialog.component';
import { ExtendedUrl } from 'src/app/modules/url/components/link/link.component';

@UntilDestroy()
@Component({
  selector: 'app-shorten-url',
  templateUrl: './shorten-url.component.html',
  styleUrls: ['./shorten-url.component.scss'],
  host: {
    class: "space-y-4"
  }
})
export class ShortenUrlComponent {
  shortenUrl?: ExtendedUrl;
  formError = "";
  isProcessing = false;

  // Save shorten urls (just prevent user from entering same url)
  cachedUrls: Url[] = [];

  @ViewChild("copyTooltip") copyTooltip!: MatTooltip;

  // Form validation messages
  urlValidationMessages: ValidationMessage = shortenUrlRequirements.originUrl.validationMsg;

  urlControl = new FormControl("", [
    Validators.required,
    FormValidator.validUrl
  ])

  getObjectKeys = getObjectKeys;

  constructor(
    private urlsService: UrlsService,
    private refService: RefService,
    private snackbar: MatSnackBar,
    private clipboard: Clipboard,
    private dialog: MatDialog
  ) {}

  onPressEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.isProcessing) {
      this.onShortenUrl();
    }
  }

  onShortenUrl() {
    if (this.urlControl.valid && !this.isProcessing) {
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

  onCopy() {
    if (this.clipboard.copy(`${this.shortenUrl?.client}/l/${this.shortenUrl?.back_half}`)) {
      // Copy to clipboard then show notification
      this.copyTooltip.disabled = false;
      this.copyTooltip.show();
      this.snackbar.open("Copied", "x", {
        duration: 2000,
        horizontalPosition: "right",
        verticalPosition: "top"
      })

      // Open dialog to suggest login
      setTimeout(() => {
        this.dialog.open(RemindDialogComponent, {
          width: "400px",
          disableClose: true,
          data: {
            shortenedUrl: this.shortenUrl
          }
        });
      }, 2000);
    }
  }

  private handleShortenSuccess(url: Url, saveCache: boolean = true) {
    // Add this link to ref links for ref when authentication
    this.refService.insertRefLink(url.id);

    if (saveCache) {
      this.cachedUrls.push(url);
    }
    this.formError = "";
    this.shortenUrl = {
      ...url,
      client: environment.client
    };
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
