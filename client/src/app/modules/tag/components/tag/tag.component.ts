import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { Tag } from 'src/app/core/models/tag.model';
import { TagsService } from 'src/app/core/services/tags.service';
import { DeleteTagDialogComponent } from '../delete-tag-dialog/delete-tag-dialog.component';

@UntilDestroy()
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  host: {
    class: 'block',
  }
})
export class TagComponent {
  @Input() tag!: Tag;

  @Output() editing = new EventEmitter<Tag>();
  @Output() deleted = new EventEmitter();

  @ViewChild("deleteButton") deleteButton!: ElementRef;

  isDeleting = false;

  constructor(
    private tagsService: TagsService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  onDelete() {
    if (this.isDeleting) {
      return;
    }

    this.isDeleting = changeStatus(this.isDeleting);
    const dialogRef = this.dialog.open(DeleteTagDialogComponent);

    dialogRef.afterClosed().pipe(
      tap(data => {
        if (data) {
          this.handleDeleteTag();
        } else {
          this.isDeleting = changeStatus(this.isDeleting);
        }
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onEditTag($event: Event) {
    if (this.deleteButton.nativeElement.contains($event.target)) {
      return;
    }

    this.editing.emit(this.tag);
  }

  private handleDeleteTag() {
    this.tagsService.deleteTag(this.tag.id).pipe(
      tap(() => {
        this.deleted.emit();
        this.snackbar.open("Tag deleted successfully", "x", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
      }, error => {
        this.handleDeleteTagFail(error);
      }),
      finalize(() => {
        this.isDeleting = changeStatus(this.isDeleting);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  private handleDeleteTagFail(error: any) {
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
