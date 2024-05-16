import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountPage } from './pages/my-account/my-account.component';
import { VerifyEmailPage } from './pages/verify-email/verify-email.component';

const routes: Routes = [
  {
    path: "verify-email",
    title: "Verify email | Grassway",
    component: VerifyEmailPage
  },
  {
    path: "",
    title: "Manage my account | Grassway",
    component: MyAccountPage
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
export class ProfileRoutingModule { }
