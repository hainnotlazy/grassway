import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { Url } from 'src/app/core/models/url.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UrlsService } from 'src/app/core/services/urls.service';
import { BehaviorSubject, filter, switchMap, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { QrcodeDialogComponent } from '../qrcode-dialog/qrcode-dialog.component';
import { EditFormDialogComponent } from '../edit-form-dialog/edit-form-dialog.component';

export interface ExtendedUrl extends Url {
  client: string;
}

@UntilDestroy()
@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  host: {
    class: "block"
  }
})
export class LinkComponent {
  @Input() url!: ExtendedUrl;
  @Input() selectingAll!: boolean | null;
  @Input() updateUrlSubject!: BehaviorSubject<Url | null>;
  @Input() deleteUrlSubject!: BehaviorSubject<Url | null>;

  @Input() selectUrlSubject!: BehaviorSubject<Url | null>;

  @ViewChild("copyTooltip") copyTooltip!: MatTooltip;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private urlsService: UrlsService
  ) {}

  onClickCheckbox() {
    this.selectUrlSubject.next(this.url);
  }

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

  onOpenQRCodeDialog() {
    this.dialog.closeAll();
    this.dialog.open(QrcodeDialogComponent, {
      data: this.url
    })
  }

  onOpenEditDialog() {
    this.dialog.closeAll();
    const updateDialog = this.dialog.open(EditFormDialogComponent, {
      width: "600px",
      data: this.url
    })

    updateDialog.afterClosed().pipe(
      filter(data => !!data),
      tap(data => {
        this.updateUrlSubject.next(data);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onOpenDeleteDialog() {
    this.dialog.closeAll();
    const deleteDialog = this.dialog.open(DeleteDialogComponent);

    deleteDialog.afterClosed().pipe(
      filter(data => data),
      switchMap(() => this.urlsService.deleteUrl(this.url.id)),
      tap(() => {
        this.deleteUrlSubject.next(this.url);
        this.snackbar.open("Deleted Successfully", "x", {
          duration: 2000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
      }, error => {
        this.handleDeleteFail(error);
      }),
      untilDestroyed(this)
    ).subscribe();
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
