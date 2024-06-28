import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { BrandsService } from 'src/app/core/services/brands.service';
import { FormValidator } from 'src/app/core/validators/form.validator';

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
  designForm = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    description: new FormControl("", [
      Validators.maxLength(255)
    ]),
    prefix: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ], FormValidator.brandPrefixExisted(this.brandsService)),
    logo: new FormControl(""),
    layout: new FormControl(""),
    headerColor: new FormControl(""),
    backgroundColor: new FormControl(""),
    titleColor: new FormControl(""),
    descriptionColor: new FormControl(""),
    shape: new FormControl(""),
    shadow: new FormControl(""),
    blockBackgroundColor: new FormControl(""),
    blockTextColor: new FormControl("")
  })

  constructor(
    private brandsService: BrandsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(event => (event instanceof Scroll || event instanceof NavigationEnd)),
        map(() => this.route.snapshot.paramMap.get("brandId") as string),
        distinctUntilChanged(),
        switchMap((brandId: string) => this.brandsService.getBrandDraft(brandId)),
        tap((brandDraft) => {
          this.designForm.patchValue({
            title: brandDraft.title,
            prefix: brandDraft.prefix,
            description: brandDraft.description,
            logo: brandDraft.logo,
            headerColor: brandDraft.header_color,
            backgroundColor: brandDraft.background_color,
            titleColor: brandDraft.title_color,
            descriptionColor: brandDraft.description_color,
            shape: brandDraft.block_shape,
            shadow: brandDraft.block_shadow,
            blockBackgroundColor: brandDraft.block_color,
            blockTextColor: brandDraft.block_text_color
          })
        }),
        untilDestroyed(this)
      ).subscribe();
  }
}
