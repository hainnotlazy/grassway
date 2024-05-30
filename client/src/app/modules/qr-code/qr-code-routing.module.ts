import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexPage } from './pages/index/index.component';

const routes: Routes = [
  {
    path: "",
    title: "QR Code | Grassway",
    component: IndexPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrCodeRoutingModule { }
