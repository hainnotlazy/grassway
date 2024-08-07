import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { IndexPage } from './pages/index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagComponent } from './components/tag/tag.component';
import { CreateTagFormComponent } from './components/create-tag-form/create-tag-form.component';
import { UpdateTagFormComponent } from './components/update-tag-form/update-tag-form.component';

const pages = [
  IndexPage
]

const components = [
  TagComponent,
  CreateTagFormComponent,
  UpdateTagFormComponent,
]

@NgModule({
  declarations: [
    ...pages,
    ...components
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    SharedModule
  ]
})
export class TagModule { }
