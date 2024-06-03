import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, filter, finalize, take, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { GetUrlsOptions } from 'src/app/core/interfaces/get-urls-options.interface';
import { Url } from 'src/app/core/models/url.model';
import { UrlsService } from 'src/app/core/services/urls.service';

@UntilDestroy()
@Component({
  selector: 'app-bulk-select',
  templateUrl: './bulk-select.component.html',
  styleUrls: ['./bulk-select.component.scss']
})
export class BulkSelectComponent implements OnInit {
  isProcessingExportCsv = false;
  isProcessingUpdateStatus = false;

  @Input() filterOptions!: GetUrlsOptions;
  @Input() myUrls$!: Observable<Url[]>;
  @Input() updateUrlSubject!: BehaviorSubject<Url | null>;
  @Input() selectUrlSubject!: BehaviorSubject<Url | null>;

  @Output() selectAll = new EventEmitter<boolean | null>();

  private selectUrl$?: Observable<Url | null>;

  selectedUrls: Url[] = [];
  selectedAll = false;

  constructor(
    private urlsService: UrlsService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.myUrls$.pipe(
      tap(() => {
        this.selectedUrls = [];
        this.selectedAll = false;
      }),
      untilDestroyed(this)
    ).subscribe();

    this.selectUrl$ = this.selectUrlSubject.asObservable();
    this.selectUrl$.pipe(
      filter(data => !!data),
      tap((url) => {
        this.handleSelectUrl(url as Url);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onExportCsv() {
    if (this.selectedUrls.length > 0 && !this.isProcessingExportCsv) {
      this.isProcessingExportCsv = changeStatus(this.isProcessingExportCsv);
      this.urlsService.exportCsv(this.selectedUrls).pipe(
        tap((response) => {
          this.handleExportCsvSuccess(response);
        }, (error) => {
          this.handleProcessFail(error);
        }),
        finalize(() => {
          this.isProcessingExportCsv = changeStatus(this.isProcessingExportCsv);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  onChangeStatusUrls() {
    if (this.selectedUrls.length > 0 && !this.isProcessingUpdateStatus) {
      this.isProcessingUpdateStatus = changeStatus(this.isProcessingUpdateStatus);
      this.urlsService.setStatusUrls(this.selectedUrls, !this.filterOptions.isActive).pipe(
        tap(() => {
          this.handleUpdateStatusSuccess();
        }, (error) => {
          this.handleProcessFail(error);
        }),
        finalize(() => {
          this.isProcessingUpdateStatus = changeStatus(this.isProcessingUpdateStatus);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  selectedSome() {
    return !!(this.selectedUrls.length > 0 && !this.selectedAll);
  }

  onSelectAll() {
    this.myUrls$.pipe(
      take(1),
      tap(data => {
        if (!this.selectedAll) {
          this.selectedAll = true;
          this.selectedUrls = data;
          this.selectAll.emit(false);
          setTimeout(() => {
            this.selectAll.emit(true);
          }, 1);
        } else {
          this.selectedAll = false;
          this.selectedUrls = [];
          this.selectAll.emit(false);
        }
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  handleSelectUrl(url: Url) {
    if (this.selectedUrls.find(selectedUrl => selectedUrl.id === url.id)) {
      this.selectedUrls = this.selectedUrls.filter(selectedUrl => selectedUrl.id !== url.id);
      this.selectedAll = false;
    } else {
      this.selectedUrls.push(url);
      this.myUrls$.pipe(
        tap(data => {
          this.selectedAll = data.length === this.selectedUrls.length;
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  private handleExportCsvSuccess(response: any) {
    const contentDisposition = response.headers.get('Content-Disposition');
    let fileName = 'urls.csv';

    if (contentDisposition) {
      const matches = /filename="([^"]*)"/.exec(contentDisposition);
      if (matches !== null && matches[1]) {
        fileName = matches[1];
      }
    }

    const blob = response.body;
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(objectUrl);

    this.selectedAll = false;
    this.selectedUrls = [];
    this.selectAll.emit(false);
    this.snackbar.open("Exported successfully", "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    });
  }

  private handleUpdateStatusSuccess() {
    for (let url of this.selectedUrls) {
      url.is_active = !this.filterOptions.isActive;
      this.updateUrlSubject.next(url);
    }
    this.selectedAll = false;
    this.selectedUrls = [];
    this.selectAll.emit(false);
    this.snackbar.open("Updated successfully", "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    });
  }

  private handleProcessFail(error: any) {
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
