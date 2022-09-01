import { LoggedInGuard } from './core/guards/logged-in.guard';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'products', pathMatch: 'full'},
  {path: 'products', loadChildren: () => import('./modules/products/products.module').then(p => p.ProductsModule)},
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(p => p.AuthModule),
  },
  {
    path: 'orders',
    loadChildren: () => import('./modules/orders/orders.module').then(p => p.OrdersModule),
    canActivate: [LoggedInGuard]
  },
  {
    path: 'cart',
    loadChildren: () => import('./modules/cart/cart.module').then(p => p.CartModule),
    canActivate: [LoggedInGuard]
  },
  {path: 'not-found', component: NotFoundComponent},
  {path: "**", redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
