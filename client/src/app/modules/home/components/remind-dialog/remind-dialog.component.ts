import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExtendedUrl } from 'src/app/core/models';
import { RegisterDialogComponent } from 'src/app/layout/components/register-dialog/register-dialog.component';

@Component({
  selector: 'app-remind-dialog',
  templateUrl: './remind-dialog.component.html',
  styleUrls: ['./remind-dialog.component.scss']
})
export class RemindDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ExtendedUrl,
    private dialog: MatDialog,
  ) {}

  openRegisterDialog() {
    this.dialog.open(RegisterDialogComponent, {
      width: "400px",
    });
  }
}
