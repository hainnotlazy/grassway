import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, finalize, map, switchMap, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { ExtendedUrl, Url } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { DeleteDialogComponent } from 'src/app/modules/url/components/delete-dialog/delete-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-brand-link',
  templateUrl: './brand-link.component.html',
  styleUrls: ['./brand-link.component.scss'],
  host: {
    class: "block"
  }
})
export class BrandLinkComponent {
  @Input() brandId!: string;
  @Input() link!: ExtendedUrl;
  @Input() linksSubject!: BehaviorSubject<Url[] | null>;

  @ViewChild("copyTooltip") copyTooltip!: MatTooltip;

  constructor(
    private brandsService: BrandsService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  onCopy() {
    this.copyTooltip.message = "Copied";
    this.snackbar.open("Copied", "x", {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })

    setTimeout(() => {
      this.copyTooltip.message = "Copy";
    }, 500)
  }

  onDelete() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(DeleteDialogComponent);

    dialogRef.afterClosed().pipe(
      filter(data => data),
      switchMap(() => this.brandsService.removeBrandLink(this.brandId, this.link.id)),
      tap(() => {
        this.handleDeleteSuccess()
      }, error => {
        this.handleDeleteFail(error);
      }),
      take(1),
      untilDestroyed(this)
    ).subscribe();
  }

  private handleDeleteSuccess() {
    this.linksSubject.asObservable().pipe(
      take(1),
      filter(urls => !!urls),
      map(urls => urls && urls.filter(url => url.id !== this.link.id)),
      tap(urls => this.linksSubject.next(urls)),
      untilDestroyed(this)
    ).subscribe();

    this.snackbar.open("Deleted Successfully", "x", {
      duration: 2000,
      horizontalPosition: "right",
      verticalPosition: "top"
    });
  }

  private handleDeleteFail(error: any) {
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
