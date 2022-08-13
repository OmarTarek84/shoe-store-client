import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./modules/products/products.module').then(p => p.ProductsModule), pathMatch: 'full'},
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(p => p.AuthModule),
  },
  {path: 'not-found', component: NotFoundComponent},
  {path: "**", redirectTo: 'not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
