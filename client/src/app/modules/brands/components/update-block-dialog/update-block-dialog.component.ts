import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, map, Observable, switchMap, take, tap } from 'rxjs';
import { blockRequirements, ValidationMessage } from 'src/app/core/forms';
import { getObjectKeys } from 'src/app/core/helpers';
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

  constructor(
    private brandsService: BrandsService,
    private dialogRef: MatDialogRef<UpdateBlockDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { block: BrandBlockDraft }
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

    this.form.patchValue({
      type: data.block.type,
      title: data.block.title,
      description: data.block.description,
      image: data.block.image,
      imageRatio: data.block.image_ratio,
      youtubeUrl: data.block.youtube_url,
      url: `${this.client}${data.block.url?.custom_back_half || data.block.url?.back_half}`
    });

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
          client: this.client
        }))
      }),
      untilDestroyed(this),
    );
  }

  onSubmit() {

  }

  onSelectUrl(url: Url) {
    this.selectedUrl = url;
  }
}
