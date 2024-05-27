import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { shortenUrlRequirements } from 'src/app/core/constants/url-form-requirement.const';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
@Component({
  selector: 'app-edit-form-dialog',
  templateUrl: './edit-form-dialog.component.html',
  styleUrls: ['./edit-form-dialog.component.scss']
})
export class EditFormDialogComponent implements OnInit {
  formError = "";
  hidePassword = true;
  isProcessing = false;

  // Form validation messages
  titleValidationMessages: ValidationMessage = shortenUrlRequirements.title.validationMsg;
  customBackHalfValidationMessages: ValidationMessage = shortenUrlRequirements.customBackHalf.validationMsg;

  getObjectKeys = getObjectKeys;

  editForm = new FormGroup({
    title: new FormControl("", [
      Validators.required
    ]),
    description: new FormControl(""),
    isActive: new FormControl(true),
    customBackHalf: new FormControl(
      "",
      [],
      FormValidator.customBackHalfExisted(this.urlsService, this.data.custom_back_half)
    ),
    password: new FormControl("")
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Url,
    private dialogRef: MatDialogRef<EditFormDialogComponent>,
    private urlsService: UrlsService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.editForm.patchValue({
      title: this.data.title,
      description: this.data.description,
      customBackHalf: this.data.custom_back_half,
      isActive: this.data.is_active
    });
  }

  onSubmit() {
    if (this.editForm.valid && !this.isProcessing) {
      this.isProcessing = true;

      this.urlsService.updateUrl({
        id: this.data.id,
        title: this.editForm.value.title as string,
        description: this.editForm.value.description as string,
        custom_back_half: this.editForm.value.customBackHalf as string,
        is_active: this.editForm.value.isActive as boolean,
        password: this.editForm.value.password as string
      }).pipe(
        tap((data) => {
          this.dialogRef.close(data);
        }, (error) => {
          this.handleEditFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  handleEditFail(error: any) {
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
