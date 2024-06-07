import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPage } from './pages/index/index.component';
import { ShortenUrlPage } from './pages/shorten-url/shorten-url.component';

const routes: Routes = [
  {
    path: "",
    title: "My Links | Grassway",
    component: IndexPage
  },
  {
    path: "shorten-url",
    title: "Shorten new link | Grassway",
    component: ShortenUrlPage
  },
  {
    path: "**",
    redirectTo: ""
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UrlRoutingModule { }
