import { ProductsListComponent } from './pages/products-list/products-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { ProductComponent } from './pages/product/product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
  },
  {
    path: ':id',
    component: ProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule {}
