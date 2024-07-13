import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, finalize, map, switchMap, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { BrandsService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.scss']
})
export class InvitationComponent {
  @Output() accepted = new EventEmitter<true>();

  brand$ = this.brandsService.currentBrand$.pipe(
    take(1)
  );
  brandId?: string;
  isProcessing = false;

  constructor(
    private brandsService: BrandsService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  handleInvitation(accepted: boolean) {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.brand$.pipe(
      tap(brand => this.brandId = brand.id),
      switchMap(brand => this.brandsService.handleInvitation(brand.id, accepted)),
      tap(() => {
        this.handleProcessSuccess(accepted);
      }, error => {
        this.handleProcessFailed(error);
      }),
      filter(() => !accepted),
      switchMap(() => this.brandsService.brands$),
      take(1),
      map(brands => brands.filter(brand => brand.id !== this.brandId)),
      tap(brands => this.brandsService.setBrands(brands)),
      finalize(() => this.isProcessing = false),
      untilDestroyed(this)
    ).subscribe();
  }

  private handleProcessSuccess(accepted: boolean) {
    if (accepted) {
      this.snackbar.open("You have joined the brand successfully", "x", {
        duration: 3000,
        horizontalPosition: "right",
        verticalPosition: "top"
      });
      this.accepted.emit(true);
    } else {
      this.snackbar.open("You have declined the invitation", "x", {
        duration: 3000,
        horizontalPosition: "right",
        verticalPosition: "top"
      });
      this.router.navigate(["/u/brands"]);
    }
  }

  private handleProcessFailed(error: any) {
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
