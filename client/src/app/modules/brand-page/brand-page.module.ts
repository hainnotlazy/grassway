import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandPageRoutingModule } from './brand-page-routing.module';
import { IndexPage } from './pages/index/index.component';
import { LayoutCurlyHeaderComponent } from './layouts/layout-curly-header/layout-curly-header.component';
import { LayoutCenterHeaderComponent } from './layouts/layout-center-header/layout-center-header.component';
import { SocialPlatformsComponent } from './components/social-platforms/social-platforms.component';
import { BlockComponent } from './components/block/block.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutNoHeaderComponent } from './layouts/layout-no-header/layout-no-header.component';

@NgModule({
  declarations: [
    IndexPage,
    LayoutCurlyHeaderComponent,
    LayoutCenterHeaderComponent,
    SocialPlatformsComponent,
    BlockComponent,
    LayoutNoHeaderComponent,
  ],
  imports: [
    CommonModule,
    BrandPageRoutingModule,
    SharedModule
  ]
})
export class BrandPageModule { }
