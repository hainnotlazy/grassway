import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomePage } from './pages/home/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShortenUrlComponent } from './components/shorten-url/shorten-url.component';
import { RemindDialogComponent } from './components/remind-dialog/remind-dialog.component';


@NgModule({
  declarations: [
    HomePage,
    ShortenUrlComponent,
    RemindDialogComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
