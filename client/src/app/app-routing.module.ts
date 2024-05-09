import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardLayout } from './layout/standard-layout/standard-layout.component';
import { FullLayout } from './layout/full-layout/full-layout.component';

const routes: Routes = [
  {
    path: "link",
    component: FullLayout,
    children: [
      {
        path: "",
        loadChildren: () => import('./modules/url/url.module').then(m => m.UrlModule)
      },
    ]
  },
  {
    path: "",
    component: StandardLayout,
    children: [
      {
        path: "",
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
