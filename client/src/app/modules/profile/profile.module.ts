import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MyAccountPage } from './pages/my-account/my-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageAccountFormComponent } from './components/manage-account-form/manage-account-form.component';
import { LinkAccountComponent } from './components/link-account/link-account.component';
import { VerifyEmailPage } from './pages/verify-email/verify-email.component';


@NgModule({
  declarations: [
    MyAccountPage,
    ManageAccountFormComponent,
    LinkAccountComponent,
    VerifyEmailPage
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
