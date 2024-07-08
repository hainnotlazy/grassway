import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-update-block-dialog',
  templateUrl: './update-block-dialog.component.html',
  styleUrls: ['./update-block-dialog.component.scss']
})
export class UpdateBlockDialogComponent {
  private readonly client = `${environment.client}/l/`;
  readonly defaultBlockImage = "/assets/images/default-block-image.jpg";
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
    urlType: new FormControl("existed"),
    url: new FormControl("")
  });
  formControls = this.form.controls;

  constructor(
    private brandsService: BrandsService,
    private dialogRef: MatDialogRef<UpdateBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { block: BrandBlockDraft },
    private snackbar: MatSnackBar
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brandId = brand.id),
    ).subscribe();

    this.formControls.type.valueChanges.pipe(
      filter(type => !!type),
      map(type => type as BlockType),
      tap(type => {
        this.watchTypeChanges(type);
      }),
      untilDestroyed(this),
    ).subscribe();

    this.formControls.urlType.valueChanges.pipe(
      filter(value => value === "new" || value === "existed"),
      map(value => value as ("new" | "existed")),
      tap(value => {
        this.watchUrlTypeChanges(value);
      }),
      untilDestroyed(this),
    ).subscribe();

    this.form.patchValue({
      type: data.block.type,
      title: data.block.title,
      description: data.block.description,
      image: data.block.image,
      imageRatio: data.block.image_ratio,
      youtubeUrl: data.block.youtube_url,
      url: `${this.client}${data.block.url?.custom_back_half || data.block.url?.back_half}`
    });
    this.selectedUrl = data.block.url;

    this.filteredUrls$ = this.formControls.url.valueChanges.pipe(
      debounceTime(300),
      filter(() => this.formControls.type.value !== BlockType.YOUTUBE),
      filter(() => this.formControls.urlType.value === "existed"),
      filter(value => !!value),
      map(value => value as string),
      distinctUntilChanged(),
      switchMap(query => this.brandsService.getFilteredBrandLinks(this.brandId, query)),
      map(urls => {
        return urls.map(url => ({
          ...url,
          client: this.client
        }))
      }),
      untilDestroyed(this),
    );
  }

  onSubmit() {
    if (this.form.invalid || this.isProcessing) return;

    const urlType = this.formControls.urlType.value;
    const updateBlockDto: BrandBlockDto = {
      type: this.formControls.type.value as BlockType,
      title: this.formControls.title.value as string,
      description: this.formControls.description.value as string,
      image: this.formControls.image.value
        ? this.formControls.image.value
        : this.defaultBlockImage,
      image_ratio: this.formControls.imageRatio.value as BlockImageRatio,
      youtube_url: this.formControls.youtubeUrl.value as string,
    }

    if (urlType === "new") {
      updateBlockDto.url = this.formControls.url.value as string;
    } else if (urlType === "existed") {
      if (this.data.block.url?.id !== this.selectedUrl?.id) {
        updateBlockDto.url_id = this.selectedUrl?.id;
      }
    }

    this.isProcessing = true;
    this.brandsService.updateBlock(this.brandId, this.data.block.id, updateBlockDto).pipe(
      tap((block) => {
        this.handleUpdateBlockSuccess(block);
      }, error => {
        this.handleUpdateBlockFailed(error);
      }),
      finalize(() => this.isProcessing = false),
      untilDestroyed(this),
    ).subscribe();
  }

  onSelectUrl(url: Url) {
    this.selectedUrl = url;
  }

  private handleUpdateBlockSuccess(block: BrandBlockDraft) {
    this.snackbar.open("Updated new block", "x", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "right",
    })
    this.dialogRef.close(block);
  }

  private handleUpdateBlockFailed(error: any) {
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

  private watchTypeChanges(typeChange: BlockType) {
    if (typeChange === BlockType.YOUTUBE) {
      this.formControls.url.clearValidators();
      this.formControls.youtubeUrl.addValidators(Validators.required);
    } else {
      this.formControls.youtubeUrl.clearValidators();

      if (this.formControls.urlType.value === "new") {
        this.formControls.url.setValidators([
          Validators.required,
          FormValidator.validUrl
        ]);
      }
    }
    this.formControls.youtubeUrl.updateValueAndValidity();
    this.formControls.url.updateValueAndValidity();
  }

  private watchUrlTypeChanges(urlTypeChange: "new" | "existed") {
    if (urlTypeChange === "new") {
      this.formControls.url.setValue("");
      this.selectedUrl = undefined;
      this.formControls.url.setValidators([
        Validators.required,
        FormValidator.validUrl
      ]);
    } else {
      this.formControls.url.setValue("");
      this.formControls.url.clearValidators();
    }
    this.formControls.url.updateValueAndValidity();
  }
}
