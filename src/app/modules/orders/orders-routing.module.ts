import { OrderComponent } from './pages/order/order.component';
import { OrdersListComponent } from './pages/orders-list/orders-list.component';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: OrdersListComponent
  },
  {
    path: ':id',
    component: OrderComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class OrdersRoutingModule {}
