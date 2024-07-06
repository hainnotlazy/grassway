import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrandsService } from 'src/app/core/services';
import { CreateLinkDialogComponent } from '../create-link-dialog/create-link-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, finalize, map, Observable, switchMap, take, tap } from 'rxjs';
import { UrlsResponse } from 'src/app/core/interfaces';
import { getValueInNumber } from 'src/app/core/helpers';
import { ExtendedUrl, Url } from 'src/app/core/models';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-brand-links-tab',
  templateUrl: './brand-links-tab.component.html',
  styleUrls: ['./brand-links-tab.component.scss']
})
export class BrandLinksTabComponent {
  fetchedLinks = false;
  brandId!: string;
  isLoading = false;
  currentPage = 1;
  totalPage = 1;

  linksSubject = new BehaviorSubject<Url[] | null>(null);
  links$: Observable<ExtendedUrl[]> = this.linksSubject.asObservable().pipe(
    filter(urls => !!urls),
    map(urls => urls as Url[]),
    map(data => {
      return data.map(url => ({
        ...url,
        client: `${environment.client}/l/`
      }))
    }),
  );

  constructor(
    private brandsService: BrandsService,
    private dialog: MatDialog
  ) {
    this.brandsService.currentBrand$.pipe(
      tap(brand => this.brandId = brand.id),
      switchMap(brand => this.brandsService.getBrandLinks(brand.id, {})),
      tap(response => {
        this.setPaginatedPage(response);
        this.linksSubject.next(response.data);
      }),
      finalize(() => this.fetchedLinks = true),
      take(1),
      untilDestroyed(this)
    ).subscribe();
  }

  openCreateLinkDialog() {
    const dialogRef = this.dialog.open(CreateLinkDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().pipe(
      filter(data => data),
      switchMap((url: Url) => this.links$.pipe(
        take(1),
        map(currentUrls => [url, ...currentUrls]),
      )),
      tap(urls => this.linksSubject.next(urls)),
      untilDestroyed(this)
    ).subscribe();
  }

  onScrollDown() {
    if (this.currentPage < this.totalPage && !this.isLoading) {
      this.isLoading = true;
      this.brandsService.getBrandLinks(this.brandId, {
        page: this.currentPage + 1
      }).pipe(
        map(response => {
          this.setPaginatedPage(response);
          return response.data;
        }),
        switchMap(urls => this.links$.pipe(
          take(1),
          map(currentUrls => [...currentUrls, ...urls]),
        )),
        tap(urls => this.linksSubject.next(urls)),
        finalize(() => this.isLoading = false),
        take(1),
        untilDestroyed(this)
      ).subscribe()
    }
  }

  private setPaginatedPage(response: UrlsResponse) {
    this.currentPage = getValueInNumber(response.meta.currentPage);
    this.totalPage = getValueInNumber(response.meta.totalPages);
  }
}
