import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog"
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.openRegisterDialog();
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: "400px",
    });
  }

  openRegisterDialog() {
    this.dialog.open(RegisterDialogComponent, {
      width: "400px",
    });
  }
}
