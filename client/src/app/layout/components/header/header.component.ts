import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from "@angular/material/dialog"
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import { isAuthenticated } from 'src/app/core/helpers';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  host: {
    class: "select-none"
  }
})
export class HeaderComponent implements OnDestroy {
  isLogin = isAuthenticated();
  isUserMenuOpen = false;

  constructor(
    private dialog: MatDialog
  ) {}

  openLoginDialog() {
    this.dialog.closeAll();
    this.dialog.open(LoginDialogComponent, {
      width: "400px",
    });
  }

  openRegisterDialog() {
    this.dialog.closeAll();
    this.dialog.open(RegisterDialogComponent, {
      width: "400px",
    });
  }

  ngOnDestroy() {
    this.dialog.closeAll();
  }
}
