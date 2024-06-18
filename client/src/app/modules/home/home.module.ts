import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './pages/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShortenUrlComponent } from './components/shorten-url/shorten-url.component';
import { RemindDialogComponent } from './components/remind-dialog/remind-dialog.component';
import { RedirectPage } from './pages/redirect/redirect.component';
import { ForgetPasswordPage } from './pages/forget-password/forget-password.component';
import { ResetPasswordPage } from './pages/reset-password/reset-password.component';

const pages = [
  HomePage,
  RedirectPage,
  ForgetPasswordPage,
  ResetPasswordPage
];

const components = [
  ShortenUrlComponent,
  RemindDialogComponent,
]

@NgModule({
  declarations: [
    ...pages,
    ...components,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
