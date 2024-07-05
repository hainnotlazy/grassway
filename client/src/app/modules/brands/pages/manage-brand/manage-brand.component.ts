import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { BrandsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'manage-brand-page',
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss'],
  host: {
    class: "block h-full"
  }
})
export class ManageBrandPage {
  brand$ = this.brandsService.currentBrand$;
  fetchedBrand = false;
  showLivePreview$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private brandsService: BrandsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.showLivePreview$ = this.breakpointObserver
      .observe(['(min-width: 1280px)'])
      .pipe(map(({ matches }) => !!matches));

    this.router.events.pipe(
      filter(event => event instanceof Scroll && event.routerEvent instanceof NavigationEnd),
      map(() => this.route.snapshot.paramMap.get("brandId") as string),
      distinctUntilChanged(),
      tap(() => this.fetchedBrand = false),
      switchMap((brandId: string) => this.brandsService.getBrandById(brandId)),
      tap(brand => {
        this.brandsService.setCurrentBrand(brand);
        this.fetchedBrand = true;
      }, () => {
        this.router.navigate(["/u/brands"]);
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
