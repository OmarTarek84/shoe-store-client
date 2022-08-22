import { StarRatingModule } from 'angular-star-rating';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductComponent } from './pages/product/product.component';
import { ProductFiltersComponent } from './components/product-filters/product-filters.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ReviewBoxComponent } from './components/review-box/review-box.component';



@NgModule({
  declarations: [
    ProductsListComponent,
    ProductComponent,
    ProductFiltersComponent,
    ProductCardComponent,
    ReviewBoxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ProductsRoutingModule,
    StarRatingModule
  ]
})
export class ProductsModule { }
