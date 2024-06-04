import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { IndexComponent } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateFormComponent } from './components/create-form/create-form.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateFormComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    SharedModule
  ]
})
export class TagModule { }
