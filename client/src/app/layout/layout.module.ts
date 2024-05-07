import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardLayout } from './standard-layout/standard-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginOauthComponent } from './components/login-oauth/login-oauth.component';
import { RegisterDialogComponent } from './components/register-dialog/register-dialog.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@NgModule({
  declarations: [
    StandardLayout,
    HeaderComponent,
    FooterComponent,
    LoginDialogComponent,
    LoginFormComponent,
    LoginOauthComponent,
    RegisterDialogComponent,
    RegisterFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    StandardLayout
  ]
})
export class LayoutModule { }
