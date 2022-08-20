import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  constructor(public productService: ProductsService) { }

  ngOnInit(): void {
    this.productService.getProducts();
    this.productService.getBrands();
  }

  pageChanged(event: PageEvent) {
    let prodParams = this.productService.getProductParams();
    prodParams.pageNumber = event.pageIndex + 1;
    prodParams.pageSize = event.pageSize;
    this.productService.setProductParams(prodParams);
  }
}
