import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { Brand } from 'src/app/core/models/brand.model';
import { BrandsService } from 'src/app/core/services/brands.service';

@UntilDestroy()
@Component({
  selector: 'manage-brand-page',
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss']
})
export class ManageBrandPage {
  brand$: Observable<Brand>;
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

    this.brand$ = this.router.events.pipe(
      filter(event => (event instanceof Scroll || event instanceof NavigationEnd)),
      map(() => this.route.snapshot.paramMap.get("brandId") as string),
      distinctUntilChanged(),
      switchMap((brandId: string) => this.brandsService.getBrandById(brandId))
    )
  }

}
