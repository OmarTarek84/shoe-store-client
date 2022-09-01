import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { OrderService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {

  constructor(public orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.getOrders();
  }

  pageChanged(event: PageEvent) {
    let orderParams = this.orderService.getOrderParams();
    orderParams.pageNumber = event.pageIndex + 1;
    orderParams.pageSize = event.pageSize;
    this.orderService.setOrderParams(orderParams);
  }

}
