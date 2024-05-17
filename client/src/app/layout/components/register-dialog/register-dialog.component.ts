import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss']
})
export class RegisterDialogComponent {
  constructor(
    private dialog: MatDialog
  ) {}

  openLoginDialog() {
    this.dialog.closeAll();
    this.dialog.open(LoginDialogComponent, {
      width: "400px",
    });
  }
}
