import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersListComponent } from './pages/orders-list/orders-list.component';
import { OrderComponent } from './pages/order/order.component';
import { OrderItemComponent } from './components/order-item/order-item.component';


@NgModule({
  declarations: [
    OrdersListComponent,
    OrderComponent,
    OrderItemComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }
