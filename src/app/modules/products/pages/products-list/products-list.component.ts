import { AuthService } from './../../../../shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ProductsService } from '../../services/products.service';
import { take } from 'rxjs';
import { UserOutDto } from 'src/app/shared/models/user';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  user!: UserOutDto | null;

  constructor(public productService: ProductsService, private route: ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(take(1))
      .subscribe((user: UserOutDto | null) => {
        this.user = user;
      });
    this.productService.getBrands();
    const qParam = this.route.snapshot.queryParams;
    if (qParam['search']) {
      let prodParams = this.productService.getProductParams();
      prodParams.productName = qParam['search'];
      this.productService.setProductParams(prodParams);
    } else {
      this.productService.getProducts();
    }

  }

  pageChanged(event: PageEvent) {
    let prodParams = this.productService.getProductParams();
    prodParams.pageNumber = event.pageIndex + 1;
    prodParams.pageSize = event.pageSize;
    this.productService.setProductParams(prodParams);
  }
}
