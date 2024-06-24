import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateBrandPage } from './pages/create-brand/create-brand.component';

const routes: Routes = [
  {
    path: "",
    title: "Brands | Grassway",
    component: CreateBrandPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
