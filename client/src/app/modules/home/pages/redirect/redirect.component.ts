import { UrlsService } from 'src/app/core/services/urls.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, finalize, switchMap, take, tap, timer } from 'rxjs';
import { Url } from 'src/app/core/models/url.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, Validators } from '@angular/forms';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'redirect-page',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectPage implements OnInit {
  hidePassword = true;
  isLoading = true;
  countdownTime = 5;
  url?: Url;

  passwordControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(255)
  ]);
  controlError = "";
  isProgressing = false;

  constructor(
    private route: ActivatedRoute,
    private urlsService: UrlsService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    const backHalf = this.route.snapshot.paramMap.get("backHalf");

    if (!backHalf) {
      this.isLoading = false;
    } else {
      this.urlsService.getUrlByBackHalf(backHalf).pipe(
        tap((data) => {
          this.url = data;
          this.handleCountingAccess(this.url.id, "visit").subscribe();
        }),
        finalize(() => this.isLoading = false),
        filter(data => data.is_active),
        filter((data) => !!data && !data.use_password),
        switchMap(() => timer(0, 1000)),
        tap(() => {
          if (this.countdownTime <= 0) {
            this.handleCountingAccess(this.url?.id as string, "redirected").pipe(
              tap(() => window.location.href = this.url?.origin_url as string)
            ).subscribe();
          } else {
            this.countdownTime -= 1;
          }
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  onPressEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onAccessProtectedUrl();
    }
  }

  onAccessProtectedUrl() {
    if (this.passwordControl.valid && !this.isProgressing) {
      this.isProgressing = true;
      this.urlsService.accessProtectedUrl(
        this.url?.id as string,
        this.passwordControl.value as string
      ).pipe(
        tap(data => {
          this.handleCountingAccess(this.url?.id as string, "redirected").pipe(
            tap(() => window.location.href = data.origin_url)
          ).subscribe();
        }, error => {
          this.handleAccessFail(error);
        }),
        finalize(() => {
          this.isProgressing = false;
        }),
        untilDestroyed(this)
      ).subscribe();
    } else if (!this.passwordControl.valid) {
      if (this.passwordControl.hasError("required")) {
        this.controlError = "Password is required";
      } else if (this.passwordControl.hasError("maxlength")) {
        this.controlError = "Password is invalid";
      }
    }
  }

  onClickRedirectUrl() {
    this.handleCountingAccess(this.url?.id as string, "redirected").pipe(
      tap(() => window.location.href = this.url?.origin_url as string),
    ).subscribe();
  }

  private handleCountingAccess(urlId: string, type: "visit" | "redirected") {
    if (type === "visit") {
      return this.urlsService.visitUrl(urlId).pipe(
        take(1),
        untilDestroyed(this)
      );
    } else {
      return this.urlsService.redirectSuccess(urlId).pipe(
        take(1),
        untilDestroyed(this)
      );
    }
  }

  private handleAccessFail(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.controlError = errorMessage;
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
