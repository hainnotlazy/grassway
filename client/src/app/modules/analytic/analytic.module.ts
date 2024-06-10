import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticRoutingModule } from './analytic-routing.module';
import { IndexPage } from './pages/index/index.component';
import { ViewStaticsPage } from './pages/view-statics/view-statics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UrlModule } from '../url/url.module';
import { OverviewTableComponent } from './components/overview-table/overview-table.component';
import { StaticsChartComponent } from './components/statics-chart/statics-chart.component';

@NgModule({
  declarations: [
    IndexPage,
    ViewStaticsPage,
    OverviewTableComponent,
    StaticsChartComponent
  ],
  imports: [
    CommonModule,
    AnalyticRoutingModule,
    UrlModule,
    SharedModule,
  ]
})
export class AnalyticModule { }
