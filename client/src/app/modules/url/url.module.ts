import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexPage } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UrlRoutingModule } from './url-routing.module';
import { ShortenUrlPage } from './pages/shorten-url/shorten-url.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';
import { LinkComponent } from './components/link/link.component';
import { StatusFilterComponent } from './components/status-filter/status-filter.component';
import { LoadingSectionComponent } from './components/loading-section/loading-section.component';
import { AdvancedFilterComponent } from './components/advanced-filter/advanced-filter.component';

const pages = [
  IndexPage,
  ShortenUrlPage,
];

const components = [
  FilterDialogComponent,
  LinkComponent,
  StatusFilterComponent,
  LoadingSectionComponent,
  AdvancedFilterComponent
]

@NgModule({
  declarations: [
    ...pages,
    ...components
  ],
  imports: [
    CommonModule,
    UrlRoutingModule,
    SharedModule
  ]
})
export class UrlModule { }
