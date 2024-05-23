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

interface ExtendedUrl extends Url {
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
  @Input() deleteUrlSubject = new BehaviorSubject<Url | null>(null);

  @ViewChild("copyTooltip") copyTooltip!: MatTooltip;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private urlsService: UrlsService
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
