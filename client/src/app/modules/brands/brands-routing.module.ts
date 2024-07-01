import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBrandPage } from './pages/create-brand/create-brand.component';
import { ManageBrandPage } from './pages/manage-brand/manage-brand.component';

const routes: Routes = [
  {
    path: ":brandId/manage",
    title: "Manage Brand | Grassway",
    component: ManageBrandPage
  },
  {
    path: "",
    title: "Brands | Grassway",
    component: CreateBrandPage
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
export class BrandsRoutingModule { }
