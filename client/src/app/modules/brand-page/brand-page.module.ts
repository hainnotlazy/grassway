import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandPageRoutingModule } from './brand-page-routing.module';
import { IndexPage } from './pages/index/index.component';
import { LayoutCurlyHeaderComponent } from './components/layout-curly-header/layout-curly-header.component';
import { LayoutCenterHeaderComponent } from './components/layout-center-header/layout-center-header.component';

@NgModule({
  declarations: [
    IndexPage,
    LayoutCurlyHeaderComponent,
    LayoutCenterHeaderComponent,
  ],
  imports: [
    CommonModule,
    BrandPageRoutingModule
  ]
})
export class BrandPageModule { }
