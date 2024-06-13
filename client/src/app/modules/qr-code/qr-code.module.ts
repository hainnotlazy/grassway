import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QrCodeRoutingModule } from './qr-code-routing.module';
import { IndexPage } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LinkCardComponent } from './components/link-card/link-card.component';

const pages = [
  IndexPage
]

const components = [
  LinkCardComponent
]

@NgModule({
  declarations: [
    ...pages,
    ...components
  ],
  imports: [
    CommonModule,
    QrCodeRoutingModule,
    SharedModule
  ]
})
export class QrCodeModule { }
