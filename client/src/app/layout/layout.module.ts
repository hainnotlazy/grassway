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
import { FullLayout } from './full-layout/full-layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserNavigationComponent } from './components/user-navigation/user-navigation.component';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [
    StandardLayout,
    HeaderComponent,
    FooterComponent,
    LoginDialogComponent,
    LoginFormComponent,
    LoginOauthComponent,
    RegisterDialogComponent,
    RegisterFormComponent,
    FullLayout,
    SidebarComponent,
    UserNavigationComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    StandardLayout,
    FullLayout
  ]
})
export class LayoutModule { }
