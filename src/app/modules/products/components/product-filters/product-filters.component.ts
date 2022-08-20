import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss']
})
export class ProductFiltersComponent implements OnInit {

  toPrice: string = '';
  fromPrice: string = '';
  brandId: number = 0;

  constructor(public productService: ProductsService) { }

  ngOnInit(): void {
  }

  brandChanged(e: MatRadioChange) {
    const brandId = e.value;
    const params = this.productService.getProductParams();
    params.brandId = brandId;
    this.productService.setProductParams(params);
  }

  fromPriceChanged(value: string) {
    const params = this.productService.getProductParams();
    params.fromPrice = value;
    this.productService.setProductParams(params);
  }

  toPriceChanged(value: string) {
    const params = this.productService.getProductParams();
    params.toPrice = value;
    this.productService.setProductParams(params);
  }

  clearFilter() {
    const params = this.productService.getProductParams();
    params.brandId = null;
    params.fromPrice = null;
    params.toPrice = null;
    params.pageNumber = 1;
    params.pageSize = 10;
    params.productName = null;
    params.sort = null;
    this.fromPrice = '0';
    this.toPrice = '0';
    this.brandId = 0;
    this.productService.setProductParams(params);
  }

}
