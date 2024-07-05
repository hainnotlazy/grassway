import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, finalize, of, switchMap, take, tap } from 'rxjs';
import { camelCaseToSnackCase } from 'src/app/core/helpers';
import { BrandDraft, BrandSocialPlatformsDraft } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-brand-design-tab',
  templateUrl: './brand-design-tab.component.html',
  styleUrls: ['./brand-design-tab.component.scss'],
  host: {
    class: "block py-4 space-y-4"
  }
})
export class BrandDesignTabComponent {
  fetchedDesign = false;
  brandId!: string;
  brandSocialPlatforms!: BrandSocialPlatformsDraft;
  designForm = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(80)
    ]),
    description: new FormControl("", [
      Validators.maxLength(100)
    ]),
    logo: new FormControl(""),
    layout: new FormControl(""),
    headerColor: new FormControl(""),
    backgroundColor: new FormControl(""),
    titleColor: new FormControl(""),
    descriptionColor: new FormControl(""),
    blockShape: new FormControl(""),
    blockShadow: new FormControl(""),
    blockColor: new FormControl(""),
    blockTextColor: new FormControl(""),
    font: new FormControl("")
  })

  constructor(
    private brandsService: BrandsService,
  ) {
    this.brandsService.currentBrand$.pipe(
      tap(brand => this.brandId = brand.id),
      switchMap(brand => this.brandsService.getBrandDraft(brand.id)),
      tap(brandDraft => {
        if (brandDraft.social_platforms) {
          this.brandSocialPlatforms = brandDraft.social_platforms;
        }
        this.patchValueDesignForm(brandDraft);

        const controlNames = Object.keys(this.designForm.controls);
        controlNames.forEach((controlName) => {
          this.designChangeHandler(controlName);
        });
      }),
      finalize(() => this.fetchedDesign = true),
      take(1),
    ).subscribe();
  }

  private patchValueDesignForm(brandDraft: BrandDraft) {
    this.designForm.patchValue({
      title: brandDraft.title,
      description: brandDraft.description,
      logo: brandDraft.logo,
      layout: brandDraft.layout,
      headerColor: brandDraft.header_color,
      backgroundColor: brandDraft.background_color,
      titleColor: brandDraft.title_color,
      descriptionColor: brandDraft.description_color,
      blockShape: brandDraft.block_shape,
      blockShadow: brandDraft.block_shadow,
      blockColor: brandDraft.block_color,
      blockTextColor: brandDraft.block_text_color,
      font: brandDraft.font
    })
  }

  private designChangeHandler(
    controlName: string
  ) {
    const control = this.designForm.get(controlName) as FormControl;
    const controlNameSnackCase = camelCaseToSnackCase(controlName);

    control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (control.invalid) {
          return of(null);
        }

        return this.brandsService.updateDesignDraft(
          this.brandId as string,
          { [controlNameSnackCase]: value }
        );
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
