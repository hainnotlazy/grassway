import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, finalize, tap } from 'rxjs';
import { shortenUrlRequirements } from 'src/app/core/constants/url-form-requirement.const';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { Tag } from 'src/app/core/models/tag.model';
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

  @ViewChild("tagInput") tagInput!: ElementRef<HTMLInputElement>;

  // Link's tags
  selectedTags: Tag[] = [];
  tags: Tag[] = [];
  filteredTags: Tag[] = [];

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
      FormValidator.customBackHalfExisted(this.urlsService, this.data.url.custom_back_half)
    ),
    editPassword: new FormControl(false),
    password: new FormControl(""),
    tags: new FormControl("")
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: Url;
      tags: Tag[]
    },
    private dialogRef: MatDialogRef<EditFormDialogComponent>,
    private urlsService: UrlsService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.tags = [...this.data.tags];
    this.data.url.tags.forEach((tag) => {
      const foundTag = this.tags.find((t) => t.id === tag.tag_id);

      if (foundTag) {
        this.selectedTags.push(foundTag);
        this.tags.splice(this.tags.indexOf(foundTag), 1);
      }
    });
    this.filteredTags = [...this.tags];

    if (this.data.url.use_password) {
      this.editForm.get("password")?.disable();
    }

    this.editForm.patchValue({
      title: this.data.url.title,
      description: this.data.url.description,
      customBackHalf: this.data.url.custom_back_half,
      isActive: this.data.url.is_active
    });

    this.editForm.get("editPassword")?.valueChanges.pipe(
      tap((value) => {
        if (value) {
          this.editForm.get("password")?.enable();
        } else {
          this.editForm.get("password")?.disable();
        }
      }),
      untilDestroyed(this)
    ).subscribe();

    this.editForm.get("tags")?.valueChanges.pipe(
      filter((value) => typeof value === "string"),
      tap((value) => {
        this.filterOption(value as string);
      })
    ).subscribe();
  }

  onSubmit() {
    if (this.editForm.valid && !this.isProcessing) {
      this.isProcessing = true;

      // Handle to get password
      let changePassword = false;
      let password = "";

      if (
        (!this.data.url.use_password && this.editForm.value.password)
        || (this.data.url.use_password && this.editForm.value.editPassword)
      ) {
        password = this.editForm.value.password as string;
        changePassword = true;
      }

      this.urlsService.updateUrl({
        id: this.data.url.id,
        title: this.editForm.value.title as string,
        description: this.editForm.value.description as string,
        custom_back_half: this.editForm.value.customBackHalf as string,
        is_active: this.editForm.value.isActive as boolean,
        change_password: changePassword,
        password,
        tags: this.selectedTags.map(tag => tag.id as unknown as string)
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

  // Functions for handling select tags
  removeSelectedTag(tag: Tag) {
    this.selectedTags = this.selectedTags.filter(selectedTag => selectedTag.id !== tag.id);
    this.addOption(tag);
  }

  selectTag(event: MatAutocompleteSelectedEvent) {
    if (!this.selectedTags.find(selectedTag => selectedTag.id === event.option.value.id)) {
      this.clearTagInput();
      const selectedTag = event.option.value;
      this.removeOption(selectedTag);
      this.selectedTags.push(selectedTag);
    }
  }

  private addOption(tag: Tag) {
    this.tags.push(tag);
    this.filteredTags = [...this.tags];
  }

  private removeOption(tag: Tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    this.filteredTags = [...this.tags];
  }

  private filterOption(value: string): void {
    if (value == "") {
      this.filteredTags = this.tags;
      return;
    }

    const filterValue = value.toLowerCase();
    this.filteredTags = this.tags.filter(tag => tag.name.toLowerCase().includes(filterValue));
  }

  private clearTagInput() {
    this.editForm.get("tags")?.setValue(null);
    this.tagInput.nativeElement.value = "";
  }

  private handleEditFail(error: any) {
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
