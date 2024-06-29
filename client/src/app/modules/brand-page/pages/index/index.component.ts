import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { BrandDraft } from 'src/app/core/models/brand-draft.model';
import { BrandsService } from 'src/app/core/services/brands.service';

@UntilDestroy()
@Component({
  selector: 'index-page',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexPage implements OnInit {
  brand?: BrandDraft;

  constructor(
    private brandsService: BrandsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => (event instanceof Scroll || event instanceof NavigationEnd)),
      map(() => this.route.snapshot.paramMap.get("prefix") as string),
      distinctUntilChanged(),
      switchMap((prefix: string) => this.brandsService.getBrandByPrefix(prefix)),
      tap(brand => {
        this.brand = brand;
      })
    ).subscribe();

    this.brandsService.getNewDesign().pipe(
      tap(newChanges => {
        if (this.brand) {
          Object.assign(this.brand, newChanges);
        }
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
