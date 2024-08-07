import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { Brand, BrandDraft, BrandLayout } from 'src/app/core/models';
import { BrandsDraftService, BrandsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage implements OnInit {
  readonly BrandLayout = BrandLayout;
  private readonly isLivePreviewSubject = new BehaviorSubject<boolean>(false);

  brand?: Brand | BrandDraft;
  disallowedLivePreview = false;
  brandNotFound = false;

  constructor(
    private brandsService: BrandsService,
    private brandsDraftService: BrandsDraftService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title
  ) {
    this.router.events.pipe(
      filter(event => event instanceof Scroll && event.routerEvent instanceof NavigationEnd),
      map(() => this.route.snapshot),
      tap(routeSnapshot => {
        const livePreviewValue = routeSnapshot.queryParamMap.get("livePreview");
        if (livePreviewValue && livePreviewValue.toLowerCase() === "true") {
          this.isLivePreviewSubject.next(true);
        } else {
          this.isLivePreviewSubject.next(false);
        }
      }),
      map(routeSnapshot => routeSnapshot.paramMap.get("prefix")),
      filter(prefix => !!prefix),
      map(prefix => prefix as string),
      switchMap(prefix => this.getBrand(prefix)),
      tap(brand => {
        this.brand = brand;
        this.brand.logo && this.setFavicon(this.brand.logo);
        this.titleService.setTitle(`${(brand.title || "") + " |"} Grassway Brands`);
      }, () => {
        this.brandNotFound = true;
      }),
      tap(() => this.sortBlocksOrder()),
      untilDestroyed(this)
    ).subscribe();
  }

  ngOnInit() {
    this.isLivePreviewSubject.asObservable().pipe(
      filter(isLivePreview => isLivePreview),
      tap(() => {
        this.livePreview();
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  hexToRgba(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  private livePreview(): void {
    this.brandsDraftService.registerGetNewChanges();
    this.brandsDraftService.watchDraftChanged().pipe(
      filter(latestBrand => latestBrand.brand_id === (this.brand as BrandDraft).brand_id),
      tap(latestBrand => Object.assign(this.brand as BrandDraft, latestBrand)),
      tap(() => this.sortBlocksOrder()),
      takeUntil(
        this.router.events.pipe(
          filter(event => event instanceof Scroll && event.routerEvent instanceof NavigationEnd),
        )
      ),
      untilDestroyed(this)
    ).subscribe();
  }

  private getBrand(prefix: string): Observable<Brand | BrandDraft> {
    return this.isLivePreviewSubject.asObservable().pipe(
      take(1),
      switchMap(isLivePreview => {
        if (isLivePreview) {
          return this.brandsDraftService.getBrandByPrefix(prefix).pipe(
            catchError(error => {
              this.disallowedLivePreview = true;
              return of(error);
            })
          );
        } else {
          return this.brandsService.getBrandByPrefix(prefix);
        }
      })
    )
  }

  private sortBlocksOrder() {
    if (!this.brand) return;

    this.brand.blocks?.sort((a, b) => {
      return b.order - a.order;
    })
  }

  private setFavicon(iconUrl: string) {
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconUrl;

    document.getElementsByTagName('head')[0].appendChild(link);
  }
}
