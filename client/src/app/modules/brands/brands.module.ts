import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { CreateBrandPage } from './pages/create-brand/create-brand.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateBrandBasicInfoComponent } from './components/create-brand-basic-info/create-brand-basic-info.component';
import { CreateBrandSocialsComponent } from './components/create-brand-socials/create-brand-socials.component';
import { CreateBrandLogoComponent } from './components/create-brand-logo/create-brand-logo.component';
import { CreateBrandInviteUserComponent } from './components/create-brand-invite-user/create-brand-invite-user.component';
import { CreateBrandFinishComponent } from './components/create-brand-finish/create-brand-finish.component';
import { CreateBrandOptionUserComponent } from './components/create-brand-option-user/create-brand-option-user.component';


@NgModule({
  declarations: [
    CreateBrandPage,
    CreateBrandBasicInfoComponent,
    CreateBrandSocialsComponent,
    CreateBrandLogoComponent,
    CreateBrandInviteUserComponent,
    CreateBrandFinishComponent,
    CreateBrandOptionUserComponent
  ],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    SharedModule
  ]
})
export class BrandsModule { }
