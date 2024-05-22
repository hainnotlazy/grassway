import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './pages/home/home.component';
import { RedirectPage } from './pages/redirect/redirect.component';

const routes: Routes = [
  {
    path: "l/:backHalf",
    title: "Redirecting ... | Grassway",
    component: RedirectPage,
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
