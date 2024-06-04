import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tagFormRequirements } from 'src/app/core/constants/tag-form-requirement.constant';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { TagsService } from 'src/app/core/services/tags.service';
import { finalize, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';

@UntilDestroy()
@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss'],
  host: {
    class: 'flex-grow'
  }
})
export class CreateFormComponent {
  formError = "";
  isProcessing = false;

  // Form requirements
  nameRequirements = tagFormRequirements.name.requirements;
  descriptionRequirements = tagFormRequirements.description.requirements;

  // Form validation messages
  nameValidationMessages: ValidationMessage = tagFormRequirements.name.validationMsg;
  descriptionValidationMessages: ValidationMessage = tagFormRequirements.description.validationMsg;

  getObjectKeys = getObjectKeys;

  form = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(this.nameRequirements.minlength),
      Validators.maxLength(this.nameRequirements.maxlength)
    ]),
    description: new FormControl("", [
      Validators.maxLength(this.descriptionRequirements.maxlength)
    ]),
    icon: new FormControl("none")
  })

  constructor(
    private tagsService: TagsService,
    private snackbar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.form.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);

      this.tagsService.createTag(
        this.form.value.name as string,
        this.form.value.icon as string,
        this.form.value.description as string,
      ).pipe(
        tap(() => {
          this.form.reset();
          this.snackbar.open("Tag created successfully", "x", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "top"
          })
        }, (error) => {
          this.handleCreateTagFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  private handleCreateTagFail(error: any) {
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
