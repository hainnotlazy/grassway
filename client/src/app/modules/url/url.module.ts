import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexPage } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UrlRoutingModule } from './url-routing.module';
import { ShortenUrlPage } from './pages/shorten-url/shorten-url.component';
import { FilterDialogComponent } from './components/filter-dialog/filter-dialog.component';

@NgModule({
  declarations: [
    IndexPage,
    ShortenUrlPage,
    FilterDialogComponent
  ],
  imports: [
    CommonModule,
    UrlRoutingModule,
    SharedModule
  ]
})
export class UrlModule { }
