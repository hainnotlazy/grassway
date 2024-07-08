import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { BrandDraft } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage implements OnInit {
  isLivePreview = false;
  brand?: BrandDraft;

  constructor(
    private brandsService: BrandsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // this.router.events.pipe(
    //   filter(event => event instanceof Scroll && event.routerEvent instanceof NavigationEnd),
    //   map(() => this.route.snapshot),
    //   tap(routeSnapshot => {
    //     const livePreviewValue = routeSnapshot.queryParamMap.get("livePreview");
    //     if (livePreviewValue) {
    //       this.isLivePreview = livePreviewValue.toLowerCase() === "true";
    //     }
    //   }),
    //   map(routeSnapshot => routeSnapshot.paramMap.get("prefix")),
    //   filter(prefix => !!prefix),
    //   map(prefix => prefix as string),
    //   switchMap(prefix => this.brandsService.getBrandByPrefix(prefix)),
    // ).subscribe();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => (event instanceof Scroll || event instanceof NavigationEnd)),
      tap(() => console.log(this.route.snapshot.queryParams)),
      map(() => this.route.snapshot.paramMap.get("prefix") as string),
      distinctUntilChanged(),
      switchMap((prefix: string) => this.brandsService.getBrandByPrefix(prefix)),
      tap(brand => {
        this.brand = brand;
      }),
      untilDestroyed(this)
    ).subscribe();

    // this.brandsService.getNewDesign().pipe(
    //   tap(newChanges => {
    //     if (this.brand) {
    //       Object.assign(this.brand, newChanges);
    //     }
    //   }),
    //   untilDestroyed(this)
    // ).subscribe();
  }

  hexToRgba(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}
