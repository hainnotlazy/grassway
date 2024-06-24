import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardLayout } from './layout/standard-layout/standard-layout.component';
import { FullLayout } from './layout/full-layout/full-layout.component';
import { authGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: "",
    title: "Grassway",
    component: StandardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: "auth",
        loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: "",
        // pathMatch: "full",
        loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
      }
    ]
  },
  {
    path: "u",
    component: FullLayout,
    title: "Grassway",
    canActivate: [authGuard],
    children: [
      {
        path: "links",
        loadChildren: () => import('./modules/url/url.module').then(m => m.UrlModule)
      },
      {
        path: "qr-codes",
        loadChildren: () => import('./modules/qr-code/qr-code.module').then(m => m.QrCodeModule)
      },
      {
        path: "tags",
        loadChildren: () => import('./modules/tag/tag.module').then(m => m.TagModule)
      },
      {
        path: "brands",
        loadChildren: () => import('./modules/brands/brands.module').then(m => m.BrandsModule)
      },
      {
        path: "analytics",
        loadChildren: () => import('./modules/analytic/analytic.module').then(m => m.AnalyticModule)
      },
      {
        path: "my-account",
        loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: "settings",
        loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
      }
    ]
  },
    {
      path: "**",
      redirectTo: ""
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
