import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, finalize, Observable, tap } from 'rxjs';
import { EditLinkDialogDto } from 'src/app/core/dtos';
import { shortenUrlRequirements, ValidationMessage } from 'src/app/core/forms';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Tag, Url } from 'src/app/core/models';
import { BrandsService, UrlsService } from 'src/app/core/services';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
@Component({
  selector: 'app-edit-link-dialog',
  templateUrl: './edit-link-dialog.component.html',
  styleUrls: ['./edit-link-dialog.component.scss']
})
export class EditLinkDialogComponent {
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

  readonly getObjectKeys = getObjectKeys;

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
    public data: EditLinkDialogDto,
    private dialogRef: MatDialogRef<EditLinkDialogComponent>,
    private urlsService: UrlsService,
    private brandsService: BrandsService,
    private snackbar: MatSnackBar
  ) {
    if (!this.data.brand && this.data.tags) {
      this.tags = [...this.data.tags];
      this.data.url.tags.forEach((tag) => {
        const foundTag = this.tags.find((t) => t.id === tag.tag_id);

        if (foundTag) {
          this.selectedTags.push(foundTag);
          this.tags.splice(this.tags.indexOf(foundTag), 1);
        }
      });
      this.filteredTags = [...this.tags];
    }

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

    if (!this.data.brand && this.data.url.tags) {
      this.editForm.get("tags")?.valueChanges.pipe(
        filter((value) => typeof value === "string"),
        tap((value) => {
          this.filterOption(value as string);
        })
      ).subscribe();
    }
  }

  onSubmit() {
    if (this.editForm.valid && !this.isProcessing) {
      this.isProcessing = true;

      this.getEditLinkHandler().pipe(
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

  private getEditLinkHandler(): Observable<Url> {
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

    const formData = {
      id: this.data.url.id,
      title: this.editForm.value.title as string,
      description: this.editForm.value.description as string,
      custom_back_half: this.editForm.value.customBackHalf as string,
      is_active: this.editForm.value.isActive as boolean,
      change_password: changePassword,
      password,
      tags: this.selectedTags.map(tag => tag.id as unknown as string)
    };

    if (this.data.brand) {
      return this.brandsService.updateBrandLink(this.data.brand.id, formData);
    } else {
      return this.urlsService.updateUrl(formData);
    }
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
