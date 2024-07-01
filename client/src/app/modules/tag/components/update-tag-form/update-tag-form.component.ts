import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { ValidationMessage, tagFormRequirements } from 'src/app/core/forms';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Tag } from 'src/app/core/models';
import { TagsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-update-tag-form',
  templateUrl: './update-tag-form.component.html',
  styleUrls: ['./update-tag-form.component.scss'],
  host: {
    class: "flex-grow"
  }
})
export class UpdateTagFormComponent implements OnInit, OnChanges {
  @Input() tag!: Tag;

  @Output() updated = new EventEmitter();

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

  ngOnInit() {
    this.form.patchValue(this.tag);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tag"]) {
      this.form.patchValue(this.tag);
    }
  }

  onSubmit() {
    if (this.form.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);

      this.tagsService.updateTag(
        this.tag.id,
        this.form.value.name as string,
        this.form.value.icon as string,
        this.form.value.description as string,
      ).pipe(
        tap(() => {
          this.updated.emit()
          this.snackbar.open("Tag updated successfully", "x", {
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
