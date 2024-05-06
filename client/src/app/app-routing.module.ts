import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StandardLayout } from './layout/standard-layout/standard-layout.component';

const routes: Routes = [
  {
    path: "",
    component: StandardLayout,
    children: [
      {
        path: "",
        loadChildren: () => import('./pages/test/test.module').then(m => m.TestModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
