import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, finalize, map, tap, timer } from 'rxjs';
import { UsersService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/forms';

@UntilDestroy()
@Component({
  selector: 'verify-email-page',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailPage {
  // Variable for check remaining time for next resend verification code
  private remainingTimeSubject = new BehaviorSubject<Date | null>(null);
  private remainingTime$ = this.remainingTimeSubject.asObservable();

  formError = "";
  isProcessing = false;

  codeControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(6)
  ]);

  codeValidationMessages: ValidationMessage = {
    required: "Verification code is required",
    minlength: "Verification code is invalid",
    maxlength: "Verification code is invalid"
  };

  currentUser$ = combineLatest([
    this.usersService.getCurrentUser(),
    this.remainingTime$
  ]).pipe(
    tap(([currentUser, remainingTime]) => {
      if (currentUser.is_email_verified) {
        this.router.navigate(['/u/my-account']);
      }
    }),
    map(([currentUser, remainingTime]) => {
      if (remainingTime) {
        currentUser.next_email_verification_time = remainingTime;
      }
      return currentUser;
    }),
    untilDestroyed(this)
  );

  showNextVerificationTime$ = combineLatest([
    this.currentUser$,
    timer(0, 1000)
  ]).pipe(
    map(([currentUser]) => {
      if (!currentUser.next_email_verification_time) {
        return false;
      }

      return currentUser.next_email_verification_time.toString() > new Date().toISOString();
    }),
    untilDestroyed(this)
  );

  getObjectKeys = getObjectKeys;

  constructor(
    private usersService: UsersService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  onPressEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.isProcessing) {
      this.onVerify();
    }
  }

  onResendVerificationCode() {
    return this.usersService.resendVerificationCode().pipe(
      tap((data) => {
        this.snackbar.open("Verification code sent to your email", 'x', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.remainingTimeSubject.next(data.next_email_verification_time);
      }, () => {
        this.snackbar.open("Failed to resend verification code", 'x', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onVerify() {
    if (!this.codeControl.valid) {
      const error = getObjectKeys(this.codeControl.errors)[0];
      this.formError = this.codeValidationMessages[error];
      this.snackbar.open(this.formError, 'x', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    } else {
      this.isProcessing = true;
      this.usersService.verifyEmail(this.codeControl.value as string).pipe(
        tap(() => {
          this.router.navigate(["/u/my-account"]);
        }, (error) => {
          this.handleVerifyFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  private handleVerifyFail(error: any) {
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
