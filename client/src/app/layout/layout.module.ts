import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardLayout } from './standard-layout/standard-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';

@NgModule({
  declarations: [
    StandardLayout,
    HeaderComponent,
    FooterComponent,
    LoginDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StandardLayout
  ]
})
export class LayoutModule { }
