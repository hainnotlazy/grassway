import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, filter, map, switchMap, take, tap } from 'rxjs';
import { EditLinkDialogDto, QrCodeDialogDto } from 'src/app/core/dtos';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Brand, ExtendedUrl, Url } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { DeleteDialogComponent } from 'src/app/shared/components/delete-dialog/delete-dialog.component';
import { EditLinkDialogComponent } from 'src/app/shared/components/edit-link-dialog/edit-link-dialog.component';
import { QrCodeDialogComponent } from 'src/app/shared/components/qr-code-dialog/qr-code-dialog.component';

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
  @Input() brand!: Brand;
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

  openQRCodeDialog() {
    this.dialog.closeAll();
    this.dialog.open<QrCodeDialogComponent, QrCodeDialogDto>(QrCodeDialogComponent, {
      data: {
        url: this.link,
        fetchUserSettings: false,
        qr_code_background_color: this.brand.qr_code_background_color,
        qr_code_foreground_color: this.brand.qr_code_foreground_color,
        qr_code_show_logo: true,
        qr_code_logo_url: this.brand.logo
      }
    })
  }

  openEditDialog() {
    this.dialog.closeAll();

    const editDialog = this.dialog.open<EditLinkDialogComponent, EditLinkDialogDto>(
      EditLinkDialogComponent,
      {
        width: '600px',
        data: {
          brand: this.brand,
          url: this.link,
        }
      }
    );

    editDialog.afterClosed().pipe(
      filter(data => !!data),
      map(data => data as Url),
      tap(updatedLink => Object.assign(this.link, updatedLink)),
      switchMap(() => this.linksSubject.asObservable()),
      take(1),
      filter(urls => !!urls),
      map(urls => urls as Url[]),
      map(urls => {
        urls.splice(
          urls.findIndex(url => url.id === this.link.id),
          1,
          this.link
        );
        return urls;
      }),
      tap(urls => this.linksSubject.next(urls)),
    ).subscribe();
  }

  onDelete() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "Are you sure you want to delete this link?",
      }
    });

    dialogRef.afterClosed().pipe(
      take(1),
      filter(data => data),
      switchMap(() => this.brandsService.removeBrandLink(this.brand.id, this.link.id)),
      tap(() => {
        this.handleDeleteSuccess()
      }, error => {
        this.handleDeleteFail(error);
      }),
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
