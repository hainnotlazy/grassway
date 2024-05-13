import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MyAccountPage } from './pages/my-account/my-account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';


@NgModule({
  declarations: [
    MyAccountPage,
    ManageAccountComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ]
})
export class ProfileModule { }
