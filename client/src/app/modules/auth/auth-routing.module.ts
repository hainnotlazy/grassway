import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuccessOauthPage } from './pages/success-oauth/success-oauth.component';

const routes: Routes = [
  {
    path: "success-authentication",
    title: "Authenticated | Grassway",
    component: SuccessOauthPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
