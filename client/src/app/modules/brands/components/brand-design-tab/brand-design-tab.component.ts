import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap } from 'rxjs';
import { camelCaseToSnackCase } from 'src/app/core/helpers/utils';
import { BrandsService } from 'src/app/core/services/brands.service';

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
  brandId?: string;
  designForm = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    description: new FormControl("", [
      Validators.maxLength(255)
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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.pipe(
      filter(event => (event instanceof Scroll || event instanceof NavigationEnd)),
      map(() => this.route.snapshot.paramMap.get("brandId") as string),
      distinctUntilChanged(),
      tap((brandId) => this.brandId = brandId),
      switchMap((brandId: string) => this.brandsService.getBrandDraft(brandId)),
      tap((brandDraft) => {
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
      }),
      tap(() => {
        const controlNames = Object.keys(this.designForm.controls);
        controlNames.forEach((controlName) => {
          this.designChangeHandler(controlName);
        })
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  private designChangeHandler(
    controlName: string
  ) {
    const control = this.designForm.get(controlName) as FormControl;
    const controlNameSnackCase = camelCaseToSnackCase(controlName);

    control.valueChanges.pipe(
      debounceTime(150),
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
