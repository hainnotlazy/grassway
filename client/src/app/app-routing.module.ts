import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardLayout } from './layout/standard-layout/standard-layout.component';
import { FullLayout } from './layout/full-layout/full-layout.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    component: StandardLayout,
    pathMatch: "full",
    canActivate: [authGuard],
    children: [
      {
        path: "",
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      },
    ]
  },
  {
    path: "u",
    component: FullLayout,
    canActivate: [authGuard],
    children: [
      {
        path: "link",
        loadChildren: () => import('./modules/url/url.module').then(m => m.UrlModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
