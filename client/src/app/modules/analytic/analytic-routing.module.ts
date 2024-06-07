import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPage } from './pages/index/index.component';
import { ViewStaticsPage } from './pages/view-statics/view-statics.component';

const routes: Routes = [
  {
    path: "",
    title: "Analytics | Grassway",
    component: IndexPage
  },
  {
    path: "view-statics/:linkId",
    title: "View statics | Grassway",
    component: ViewStaticsPage
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
export class AnalyticRoutingModule { }
