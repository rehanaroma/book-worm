import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'catalogue/:categoryId',
    loadComponent: () => import('./pages/catalogue-page/catalogue-page.component').then((m) => m.CataloguePageComponent),
  },
  {
    path: 'book/:bookId',
    loadComponent: () => import('./pages/book-detail-page/book-detail-page.component').then((m) => m.BookDetailPageComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart-page/cart-page.component').then((m) => m.CartPageComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/order-history-page/order-history-page.component').then((m) => m.OrderHistoryPageComponent),
  },
  {
    path: 'wishlist',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/wishlist-page/wishlist-page.component').then((m) => m.WishlistPageComponent),
  },
  {
    path: 'writers',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/writers-page/writers-page.component').then((m) => m.WritersPageComponent),
  },
  { path: '**', redirectTo: '' },
];
