import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  constructor(
    private dialog: MatDialog
  ) {}

  openRegisterDialog() {
    this.dialog.closeAll();
    this.dialog.open(RegisterDialogComponent, {
      width: "400px",
    });
  }
}
