import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticRoutingModule } from './analytic-routing.module';
import { IndexPage } from './pages/index/index.component';
import { ViewStaticsPage } from './pages/view-statics/view-statics.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    IndexPage,
    ViewStaticsPage
  ],
  imports: [
    CommonModule,
    AnalyticRoutingModule,
    SharedModule
  ]
})
export class AnalyticModule { }
