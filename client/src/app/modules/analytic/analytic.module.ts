import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticRoutingModule } from './analytic-routing.module';
import { IndexPage } from './pages/index/index.component';
import { ViewStaticsPage } from './pages/view-statics/view-statics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UrlModule } from '../url/url.module';
import { OverviewTableComponent } from './components/overview-table/overview-table.component';
import { StaticsChartComponent } from './components/statics-chart/statics-chart.component';
import { LinkComponent } from './components/link/link.component';
import { OverviewChartsComponent } from './components/overview-charts/overview-charts.component';

const pages = [
  IndexPage,
  ViewStaticsPage
]

const components = [
  OverviewTableComponent,
  StaticsChartComponent,
  LinkComponent,
  OverviewChartsComponent
]

@NgModule({
  declarations: [
    ...pages,
    ...components
  ],
  imports: [
    CommonModule,
    AnalyticRoutingModule,
    UrlModule,
    SharedModule,
  ]
})
export class AnalyticModule { }
