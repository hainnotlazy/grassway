import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { RedirectPage } from './pages/redirect/redirect.component';
import { ForgetPasswordPage } from './pages/forget-password/forget-password.component';
import { ResetPasswordPage } from './pages/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: "l/:backHalf",
    title: "Redirecting ... | Grassway",
    component: RedirectPage,
  },
  {
    path: "forget-password",
    title: "Forget Password | Grassway",
    component: ForgetPasswordPage
  },
  {
    path: "reset-password",
    title: "Reset Password | Grassway",
    component: ResetPasswordPage
  },
  {
    path: "",
    title: "Let's shorten your link | Grassway",
    pathMatch: "full",
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
