import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, finalize, map, Observable, switchMap, take, tap } from 'rxjs';
import { BrandBlockDto } from 'src/app/core/dtos';
import { blockRequirements, ValidationMessage } from 'src/app/core/forms';
import { getObjectKeys } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces';
import { BlockImageRatio, BlockType, BrandBlockDraft, ExtendedUrl, Url } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { FormValidator } from 'src/app/core/validators/form.validator';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-create-block-dialog',
  templateUrl: './create-block-dialog.component.html',
  styleUrls: ['./create-block-dialog.component.scss']
})
export class CreateBlockDialogComponent {
  readonly BlockType = BlockType;
  readonly BlockImageRatio = BlockImageRatio;

  brandId!: string;
  isProcessing = false;
  formError = "";
  filteredUrls$: Observable<ExtendedUrl[]>;
  selectedUrl?: Url;

  // Form requirements
  titleRequirements = blockRequirements.title.requirements;
  descriptionRequirements = blockRequirements.description.requirements;
  youtubeUrlRequirements = blockRequirements.youtubeUrl.requirements;

  // Form validation messages
  titleValidationMsg: ValidationMessage = blockRequirements.title.validationMsg;
  descriptionValidationMsg: ValidationMessage = blockRequirements.description.validationMsg;
  youtubeUrlValidationMsg: ValidationMessage = blockRequirements.youtubeUrl.validationMsg;
  urlValidationMsg: ValidationMessage = blockRequirements.url.validationMsg;

  getObjectKeys = getObjectKeys;

  form = new FormGroup({
    type: new FormControl(BlockType.BUTTON),
    title: new FormControl("", [
      Validators.required,
      Validators.minLength(this.titleRequirements.minlength),
      Validators.maxLength(this.titleRequirements.maxlength)
    ]),
    description: new FormControl("", [
      Validators.maxLength(this.descriptionRequirements.maxlength)
    ]),
    image: new FormControl(""),
    imageRatio: new FormControl(BlockImageRatio.RATIO_ORIGIN),
    youtubeUrl: new FormControl("", [
      FormValidator.validYoutubeEmbedLink,
      Validators.maxLength(this.youtubeUrlRequirements.maxlength),
    ]),
    urlType: new FormControl("new"),
    url: new FormControl("", [
      Validators.required,
      FormValidator.validUrl
    ])
  });

  constructor(
    private brandsService: BrandsService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<CreateBlockDialogComponent>
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brandId = brand.id),
    ).subscribe();

    this.form.controls.type.valueChanges.pipe(
      tap(type => {
        if (type !== BlockType.YOUTUBE) {
          this.form.controls.url.setValidators([
            Validators.required,
            FormValidator.validUrl
          ]);
          this.form.controls.youtubeUrl.removeValidators(Validators.required);
        } else {
          this.form.controls.url.clearValidators();
          this.form.controls.youtubeUrl.addValidators(Validators.required);
        }
        this.form.controls.url.updateValueAndValidity();
      }),
      untilDestroyed(this),
    ).subscribe();

    this.form.controls.urlType.valueChanges.pipe(
      tap(value => {
        if (value === "new") {
          this.form.controls.url.setValue("");
          this.selectedUrl = undefined;
          this.form.controls.url.setValidators([
            Validators.required,
            FormValidator.validUrl
          ]);
        } else {
          this.form.controls.url.setValue("");
          this.form.controls.url.clearValidators();
        }
        this.form.controls.url.updateValueAndValidity();
      }),
      untilDestroyed(this),
    ).subscribe();

    this.filteredUrls$ = this.form.controls.url.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.form.controls.type.value !== BlockType.YOUTUBE),
      filter(() => this.form.controls.urlType.value === "existed"),
      filter(value => !!value),
      map(value => value as string),
      distinctUntilChanged(),
      switchMap(query => this.brandsService.getFilteredBrandLinks(this.brandId, query)),
      map(urls => {
        return urls.map(url => ({
          ...url,
          client: `${environment.client}/l/`
        }))
      }),
      untilDestroyed(this),
    )
  }

  onSubmit() {
    if (this.form.invalid || this.isProcessing) return;

    const urlType = this.form.controls.urlType.value;
    const createBlockDto: BrandBlockDto = {
      type: this.form.controls.type.value as BlockType,
      title: this.form.controls.title.value as string,
      description: this.form.controls.description.value as string,
      image: this.form.controls.image.value as string,
      image_ratio: this.form.controls.imageRatio.value as BlockImageRatio,
      youtube_url: this.form.controls.youtubeUrl.value as string,
    }

    if (urlType === "new") {
      createBlockDto.url = this.form.controls.url.value as string;
    } else if (urlType === "existed") {
      if (!this.selectedUrl) {
        this.formError = "Please select valid existed url";
        return;
      }
      createBlockDto.url_id = this.selectedUrl.id;
    }

    this.isProcessing = true;
    this.brandsService.createBlock(this.brandId, createBlockDto).pipe(
      tap((block) => {
        this.handleCreateBlockSuccess(block);
      }, error => {
        this.handleCreateBlockFailed(error);
      }),
      finalize(() => this.isProcessing = false),
      untilDestroyed(this),
    ).subscribe();
  }

  onSelectUrl(url: Url) {
    this.selectedUrl = url;
  }

  private handleCreateBlockSuccess(block: BrandBlockDraft) {
    this.snackbar.open("Created new block", "x", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "right",
    })
    this.dialogRef.close(block);
  }

  private handleCreateBlockFailed(error: any) {
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
