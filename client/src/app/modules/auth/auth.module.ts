import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessOauthPage } from './pages/success-oauth/success-oauth.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    SuccessOauthPage
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
