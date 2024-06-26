import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map, take, tap } from 'rxjs';
import { Brand } from 'src/app/core/models/brand.model';
import { BrandsService } from 'src/app/core/services/brands.service';

@UntilDestroy()
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  host: {
    class: "select-none"
  }
})
export class SidebarComponent {
  isInitialSidebarState = true;
  isSidebarOpen = false;
  isLgScreen = false;

  fetchedBrands = false;
  isBrandItemOpen = false;
  isInBrandRoute = false;
  brands: Brand[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private brandsService: BrandsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.breakpointObserver.observe(['(min-width: 1024px)']).pipe(
      map(({ matches }) => this.isLgScreen = matches),
      untilDestroyed(this)
    ).subscribe();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      tap(() => {
        const currentRoute = this.route.snapshot.firstChild?.routeConfig?.path || '';
        this.isInBrandRoute = currentRoute === 'brands';
        if (currentRoute === 'brands' && !this.fetchedBrands) {
          this.onClickBrandItem(false);
        }
      }),
      untilDestroyed(this)
    )
    .subscribe();
  }

  onClickNavigationItem() {
    if (!this.isLgScreen) {
      this.isSidebarOpen = !this.isSidebarOpen;
      this.isInitialSidebarState = false
    }
  }

  onClickBrandItem(closeDropdown: boolean = true) {
    if (this.fetchedBrands && closeDropdown) {
      this.isBrandItemOpen = !this.isBrandItemOpen;
      return;
    }

    this.brandsService.getBrands().pipe(
      take(1),
      tap((brands) => {
        this.brands = brands;
        this.isBrandItemOpen = true;
        this.fetchedBrands = true;
      }),
      untilDestroyed(this)
    ).subscribe();
  }
}
