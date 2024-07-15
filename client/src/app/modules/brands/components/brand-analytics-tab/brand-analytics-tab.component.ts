import { Component } from '@angular/core';
import { take, tap } from 'rxjs';
import { Brand } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';

@Component({
  selector: 'app-brand-analytics-tab',
  templateUrl: './brand-analytics-tab.component.html',
  styleUrls: ['./brand-analytics-tab.component.scss']
})
export class BrandAnalyticsTabComponent {
  brand!: Brand;

  constructor(
    private brandsService: BrandsService
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brand = brand)
    ).subscribe();
  }
}
