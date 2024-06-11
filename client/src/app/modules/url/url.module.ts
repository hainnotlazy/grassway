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
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { QrcodeDialogComponent } from './components/qrcode-dialog/qrcode-dialog.component';
import { EditFormDialogComponent } from './components/edit-form-dialog/edit-form-dialog.component';
import { BulkSelectComponent } from './components/bulk-select/bulk-select.component';
import { SearchComponent } from './components/search/search.component';
import { OptionTagComponent } from './components/option-tag/option-tag.component';
import { TagBadgeComponent } from './components/tag-badge/tag-badge.component';

const pages = [
  IndexPage,
  ShortenUrlPage,
];

const components = [
  FilterDialogComponent,
  LinkComponent,
  StatusFilterComponent,
  LoadingSectionComponent,
  AdvancedFilterComponent,
  DeleteDialogComponent,
  QrcodeDialogComponent,
  EditFormDialogComponent,
  BulkSelectComponent,
  SearchComponent,
  OptionTagComponent,
  TagBadgeComponent
]

@NgModule({
  declarations: [
    ...pages,
    ...components,
  ],
  imports: [
    CommonModule,
    UrlRoutingModule,
    SharedModule
  ],
  exports: [
    TagBadgeComponent,
    LoadingSectionComponent
  ]
})
export class UrlModule { }
