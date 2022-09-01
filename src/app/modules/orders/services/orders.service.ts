import { PaginationParams } from './../../../shared/models/paginationParams';
import { Pagination } from './../../../shared/models/pagination';
import { environment } from './../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OrderOutDto } from './../models/orderDto';
import { BehaviorSubject, map } from 'rxjs';
import { Injectable } from "@angular/core";
import { OrderParams } from '../models/orderParams';

@Injectable({providedIn: 'root'})
export class OrderService {

  private ordersSource = new BehaviorSubject<OrderOutDto[]>([]);
  orders$ = this.ordersSource.asObservable();

  private orderParams: OrderParams = new OrderParams();
  private orderPagination = new PaginationParams();

  constructor(private http: HttpClient) {}

  getOrderParams() {
    return this.orderParams;
  }

  setOrderParams(params: OrderParams) {
    this.orderParams = params;
    this.getOrders();
  }

  getOrderPaginator() {
    return this.orderPagination;
  }

  getOrders() {
    let params = new HttpParams();

    if (this.orderParams.pageNumber)
      params = params.set('pageNumber', this.orderParams.pageNumber);

    if (this.orderParams.pageSize)
      params = params.set('pageSize', this.orderParams.pageSize);

    if (this.orderParams.sortLatest)
      params = params.set('sortLatest', this.orderParams.sortLatest);

    if (this.orderParams.sortPrice)
      params = params.set('sortPrice', this.orderParams.sortPrice);


    this.http.get<Pagination<OrderOutDto>>(environment.appUrl + 'api/Order', {params}).pipe(
      map(order => {
        this.ordersSource.next(order.list);
        this.orderPagination.pageNumber = order.pageNumber;
        this.orderPagination.pageSize = order.pageSize;
        this.orderPagination.count = order.count;
      })
    ).subscribe();
  }

}
