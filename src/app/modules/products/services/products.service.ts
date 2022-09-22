import { PaginationParams } from './../../../shared/models/paginationParams';
import { environment } from './../../../../environments/environment';
import { Pagination } from './../../../shared/models/pagination';
import { HttpClient } from '@angular/common/http';
import { ProductParams } from './../models/productParams';
import { ProductOutDto } from './../models/productDto';
import { BehaviorSubject, Observable, map, take, of } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpParams } from '@angular/common/http';
import { BrandOutDto } from '../models/BrandDto';
import { ReviewInDto, ReviewOutDto } from '../models/reviewDto';

@Injectable({providedIn: 'root'})
export class ProductsService {

  private productSource = new BehaviorSubject<ProductOutDto[]>([]);
  products$ = this.productSource.asObservable();

  private brandSource = new BehaviorSubject<BrandOutDto[]>([]);
  brands$ = this.brandSource.asObservable();

  private productParams = new ProductParams();
  private productPagination = new PaginationParams();

  constructor(private http: HttpClient) {}

  getProductParams() {
    return this.productParams;
  }

  setProductParams(params: ProductParams) {
    this.productParams = params;
    this.getProducts();
  }

  getProducts() {
    let prodParams = new HttpParams();

    if (this.productParams.pageNumber !== null)
      prodParams = prodParams.append('pageNumber', this.productParams.pageNumber > 0 ? this.productParams.pageNumber: 1);

    if (this.productParams.pageSize)
      prodParams = prodParams.append('pageSize', this.productParams.pageSize > 1 ? this.productParams.pageSize: 1);

    if (this.productParams.brandId)
      prodParams = prodParams.append('brandId', this.productParams.brandId);

    if (this.productParams.fromPrice)
      prodParams = prodParams.append('fromPrice', this.productParams.fromPrice);

    if (this.productParams.productName)
      prodParams = prodParams.append('productName', this.productParams.productName);

    if (this.productParams.sort)
      prodParams = prodParams.append('sort', this.productParams.sort);

    if (this.productParams.toPrice)
      prodParams = prodParams.append('toPrice', this.productParams.toPrice);

    return this.http.get<Pagination<ProductOutDto>>(environment.appUrl + 'api/product', {params: prodParams}).pipe(
      map((res: Pagination<ProductOutDto>) => {
        this.productSource.next(res.list);
        this.productPagination.pageNumber = res.pageNumber;
        this.productPagination.pageSize = res.pageSize;
        this.productPagination.count = res.count;
      })
    ).subscribe();
  }

  resetProductParams() {
    this.productParams = new ProductParams();
    this.productPagination = new PaginationParams();
  }

  getProduct(productId: number) {
    return this.products$.pipe(
      take(1),
      map((products: ProductOutDto[]) => {
        const prod = products.find(p => p.id === productId);
        return prod;
      })
    )
  }

  getUserReview(productId: number) {
    return this.http.get<ReviewOutDto>(environment.appUrl + 'api/Product/user-review?productId=' + productId).pipe(take(1));
  }

  getProductPaginator(): PaginationParams {
    return this.productPagination;
  }

  getProductFromAPI(prodId: number) {
    return this.http.get<ProductOutDto>(environment.appUrl + 'api/Product/' + prodId);
  }

  addReview(reviewInDto:ReviewInDto) {
    return this.http.post<ReviewOutDto>(environment.appUrl + 'api/Product/add-review',reviewInDto);
  }

  getBrands() {
    if (this.brandSource.value && this.brandSource.value.length > 0) {
      return of(this.brandSource.value);
    }

    return this.http.get<BrandOutDto[]>(environment.appUrl + 'api/Brand').pipe(
      map((res: BrandOutDto[]) => {
        this.brandSource.next(res);
      })
    ).subscribe();
  }

}
