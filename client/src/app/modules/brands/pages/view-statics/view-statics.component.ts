import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, finalize, map, switchMap, take, tap } from 'rxjs';
import { Brand, BrandMember, ExtendedUrl, Url } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'view-statics-page',
  templateUrl: './view-statics.component.html',
  styleUrls: ['./view-statics.component.scss']
})
export class ViewStaticsPage {
  brandId!: string;
  brand!: Brand;
  linkId!: number;
  link!: ExtendedUrl;

  joinedBrand = false;
  fetchedStatics = false;

  constructor(
    private brandsService: BrandsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.router.events.pipe(
      take(1),
      tap(() => {
        const paramMap = this.route.snapshot.paramMap;
        this.brandId = paramMap.get("brandId") as string;
        try {
          this.linkId = parseInt(paramMap.get("linkId") as string);
        } catch (err) {
          this.redirectToAnalyticsPage();
        }
      }),
      switchMap(() => this.brandsService.getBrandById(this.brandId)),
      tap(brand => {
        this.brand = brand;
        this.brandsService.setCurrentBrand(brand);
      }, () => {
        this.redirectToAnalyticsPage();
      }),
      switchMap(brand => this.brandsService.getRole(brand.id)),
      tap((role: BrandMember) => {
        if (!role.joined) {
          this.redirectToBrandPage();
        }
      }),
      switchMap(() => this.brandsService.getBrandLinkById(this.brandId, this.linkId)),
      map(link => ({
        ...link,
        client: `${environment.client}`
      })),
      tap(link => {
        this.link = link;
      }, () => {
        this.redirectToBrandPage();
      }),
      finalize(() => this.fetchedStatics = true),
      untilDestroyed(this)
    ).subscribe();
  }

  private redirectToAnalyticsPage() {
    this.router.navigate(["/u/analytics"]);
  }

  private redirectToBrandPage() {
    this.router.navigate(["/u/brands", this.brandId, "manage"]);
  }
}
