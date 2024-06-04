import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { changeStatus } from 'src/app/core/helpers/utils';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { Tag } from 'src/app/core/models/tag.model';
import { TagsService } from 'src/app/core/services/tags.service';

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

  isDeleting = false;

  constructor(
    private tagsService: TagsService,
    private snackbar: MatSnackBar
  ) {}

  onDelete() {
    if (this.isDeleting) {
      return;
    }

    this.isDeleting = changeStatus(this.isDeleting);
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

  onEditTag() {
    this.editing.emit(this.tag);
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
