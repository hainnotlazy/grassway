import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, finalize, switchMap, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Brand, BrandMember, BrandMemberRole } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-brand-member',
  templateUrl: './brand-member.component.html',
  styleUrls: ['./brand-member.component.scss'],
  host: {
    class: "block"
  }
})
export class BrandMemberComponent {
  readonly client = `${environment.client}/`;
  readonly BrandMemberRole = BrandMemberRole;

  @Input() member!: BrandMember;
  @Input() isOwner!: boolean;
  @Input() isProcessingSubject!: BehaviorSubject<boolean>;
  @Output() transferredOwnership = new EventEmitter<BrandMember>();
  @Output() deleted = new EventEmitter<BrandMember>();

  brand!: Brand;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private brandsService: BrandsService
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brand = brand),
    ).subscribe();
  }

  onTransferOwnership() {
    this.dialog.closeAll();

    const transferDialog = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: `Are you sure you want to transfer ownership to "${this.member.user?.fullname}"?`,
      }
    });

    transferDialog.afterClosed().pipe(
      take(1),
      filter(data => !!data),
      switchMap(() => this.isProcessingSubject.asObservable()),
      take(1),
      filter(isProcessing => !isProcessing),
      tap(() => this.isProcessingSubject.next(true)),
      switchMap(() => this.brandsService.transferOwnership(this.brand.id, this.member.user?.id as number)),
      tap(() => {
        this.snackbar.open("Transferred ownership successfully", "x", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
        this.transferredOwnership.emit(this.member);
      }, error => {
        this.handleProcessFailed(error);
      }),
      finalize(() => this.isProcessingSubject.next(false)),
      untilDestroyed(this)
    ).subscribe();
  }

  onRemoveMember() {
    this.dialog.closeAll();

    const deleteDialog = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: `Are you sure you want to remove "${this.member.user?.fullname}" from brand?`,
      }
    });

    deleteDialog.afterClosed().pipe(
      take(1),
      filter(data => !!data),
      switchMap(() => this.isProcessingSubject.asObservable()),
      take(1),
      filter(isProcessing => !isProcessing),
      tap(() => this.isProcessingSubject.next(true)),
      switchMap(() => this.brandsService.removeMember(this.brand.id, this.member.user?.id as number)),
      tap(() => {
        this.snackbar.open("Removed member successfully", "x", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
        this.deleted.emit(this.member);
      }, error => {
        this.handleProcessFailed(error);
      }),
      finalize(() => this.isProcessingSubject.next(false)),
      untilDestroyed(this)
    ).subscribe();
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
