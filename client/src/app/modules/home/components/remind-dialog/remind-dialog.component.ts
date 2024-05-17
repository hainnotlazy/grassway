import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from 'src/app/layout/components/register-dialog/register-dialog.component';

@Component({
  selector: 'app-remind-dialog',
  templateUrl: './remind-dialog.component.html',
  styleUrls: ['./remind-dialog.component.scss']
})
export class RemindDialogComponent {
  constructor(
    private dialog: MatDialog
  ) {}

  openRegisterDialog() {
    // this.dialog.closeAll();
    this.dialog.open(RegisterDialogComponent, {
      width: "400px",
    });
  }
}
