import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-tag-dialog',
  templateUrl: './delete-tag-dialog.component.html',
  styleUrls: ['./delete-tag-dialog.component.scss']
})
export class DeleteTagDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<DeleteTagDialogComponent>
  ) {}

  onDeleteClick() {
    this.dialogRef.close(true);
  }
}
