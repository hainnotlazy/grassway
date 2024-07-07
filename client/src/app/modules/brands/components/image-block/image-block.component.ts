import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, finalize, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { BrandBlockDraft } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'app-image-block',
  templateUrl: './image-block.component.html',
  styleUrls: ['./image-block.component.scss'],
  host: {
    class: "block"
  }
})
export class ImageBlockComponent {
  client = `${environment.client}/l/`;
  defaultImage = "/assets/images/default-block-image.jpg";
  brandId!: string;
  isProcessing = false;

  @Input() block!: BrandBlockDraft;
  @Output() deleted = new EventEmitter<BrandBlockDraft>();

  constructor(
    private brandsService: BrandsService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brandId = brand.id),
    ).subscribe();
  }

  openDeleteDialog() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Are you sure you want to delete this block?",
      }
    });

    dialogRef.afterClosed().pipe(
      take(1),
      filter(data => data),
      tap(() => this.onDelete()),
      untilDestroyed(this)
    ).subscribe();
  }

  onDelete() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.brandsService.removeBrandBlock(this.brandId, this.block.id).pipe(
      tap(() => {
        this.deleted.emit(this.block);
      }, error => {
        this.handleDeleteFailed(error);
      }),
      finalize(() => (this.isProcessing = false)),
      untilDestroyed(this)
    ).subscribe();
  }

  private handleDeleteFailed(error: any) {
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
