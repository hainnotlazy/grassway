import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, distinctUntilChanged, filter, finalize, map, switchMap, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { BrandMember } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

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
  readonly client = environment.client;
  brand$ = this.brandsService.currentBrand$;
  joinedBrand = false;
  fetchedBrand = false;
  isProcessing = false;
  showLivePreview$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private brandsService: BrandsService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
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
      }, () => {
        this.router.navigate(["/u/brands"]);
      }),
      switchMap(() => this.brand$),
      switchMap(brand => this.brandsService.getRole(brand.id)),
      tap((role: BrandMember) => {
        this.joinedBrand = role.joined;
        this.fetchedBrand = true;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onCopy() {
    this.snackbar.open("Copied brand page link", "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

  onPublishChanges() {
    if (this.isProcessing) {
      return;
    }

    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(() => this.isProcessing = true),
      switchMap(brand => this.brandsService.publishChanges(brand.id)),
      tap(() => {
        this.snackbar.open("Changes published successfully", "x", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "top"
        })
      }, err => {
        this.handlePublishFailed(err);
      }),
      finalize(() => this.isProcessing = false),
      untilDestroyed(this)
    ).subscribe();
  }

  onJoinBrand() {
    this.joinedBrand = true;
  }

  private handlePublishFailed(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
