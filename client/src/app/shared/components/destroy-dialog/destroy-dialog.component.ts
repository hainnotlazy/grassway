import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  itemName: string;
  title: string;
}

@Component({
  selector: 'app-destroy-dialog',
  templateUrl: './destroy-dialog.component.html',
  styleUrls: ['./destroy-dialog.component.scss']
})
export class DestroyDialogComponent {
  title!: string;
  itemName!: string;
  formError = "";

  itemNameControl = new FormControl("", [
    Validators.required
  ]);

  constructor(
    private dialogRef: MatDialogRef<DestroyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.title = data.title;
    this.itemName = data.itemName;
  }

  onDeleteClick() {
    if (this.itemNameControl.value !== this.itemName || this.itemNameControl.invalid) {
      this.itemNameControl.markAllAsTouched();
      this.formError = "Your typed name is not match";
      return;
    }

    this.dialogRef.close(true);
  }
}
