import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandPageRoutingModule } from './brand-page-routing.module';
import { IndexPage } from './pages/index/index.component';


@NgModule({
  declarations: [
    IndexPage
  ],
  imports: [
    CommonModule,
    BrandPageRoutingModule
  ]
})
export class BrandPageModule { }
