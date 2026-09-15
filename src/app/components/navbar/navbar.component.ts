import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';

const navLinks = [
  { label: 'My Orders', to: '/orders' },
  { label: 'My Wishlist', to: '/wishlist' },
  { label: 'My Writers', to: '/writers' },
];

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, UserMenuComponent],
  template: `
    <nav class="h-14 flex items-center px-4 md:px-6 gap-3 sticky top-0 z-50 bg-nav theme-transition"
         style="border-bottom: 1px solid var(--bw-nav-border); box-shadow: var(--bw-shadow-sm)">
      <!-- Logo -->
      <a routerLink="/" class="flex items-center gap-2 font-bold text-lg shrink-0 mr-2 text-primary">
        <svg class="w-5 h-5" style="color: var(--bw-cta)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
        </svg>
        <span class="hidden sm:inline" style="color: var(--bw-text-primary)">Book Worm</span>
      </a>

      <div class="hidden md:block w-px h-6" style="background: var(--bw-border)"></div>

      <!-- Nav links desktop -->
      <div class="hidden md:flex items-center gap-1">
        @for (link of navLinks; track link.to) {
          <a [routerLink]="link.to" class="px-3 py-1.5 text-sm transition-colors"
             [style.color]="currentPath === link.to ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)'"
             [style.background]="currentPath === link.to ? 'var(--bw-bg-active)' : 'transparent'"
             [style.fontWeight]="currentPath === link.to ? '600' : '400'">
            {{ link.label }}
          </a>
        }
      </div>

      <div class="flex-1"></div>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Wishlist -->
        <button (click)="handleWishlistClick()" class="relative p-1.5 transition-colors hidden sm:flex items-center"
                [style.color]="wishlistSvc.totalItems() > 0 ? 'var(--bw-danger)' : 'var(--bw-text-secondary)'">
          <svg class="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
               [attr.fill]="wishlistSvc.totalItems() > 0 ? 'currentColor' : 'none'">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          @if (wishlistSvc.totalItems() > 0) {
            <span class="absolute -top-0.5 -right-0.5 text-[10px] min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5"
                  style="background: var(--bw-danger); color: #fff">
              {{ wishlistSvc.totalItems() > 99 ? '99+' : wishlistSvc.totalItems() }}
            </span>
          }
        </button>

        <!-- Cart -->
        <button (click)="router.navigate(['/cart'])" class="relative p-1.5 transition-colors flex items-center"
                style="color: var(--bw-text-secondary)">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          @if (cartSvc.totalItems() > 0) {
            <span class="absolute -top-0.5 -right-0.5 text-[10px] min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5"
                  style="background: var(--bw-danger); color: #fff">
              {{ cartSvc.totalItems() > 99 ? '99+' : cartSvc.totalItems() }}
            </span>
          }
        </button>

        <app-theme-toggle />
        <app-user-menu />

        <!-- Mobile hamburger -->
        <button class="md:hidden p-1.5 transition-colors" (click)="mobileOpen = !mobileOpen"
                style="color: var(--bw-text-secondary)">
          @if (mobileOpen) {
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          } @else {
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </div>

      <!-- Mobile dropdown -->
      @if (mobileOpen) {
        <div class="absolute top-14 left-0 right-0 z-50 md:hidden"
             style="background: var(--bw-nav-bg); border-bottom: 1px solid var(--bw-border); box-shadow: var(--bw-shadow-md)">
          @for (link of navLinks; track link.to) {
            <a [routerLink]="link.to" (click)="mobileOpen = false" class="block px-5 py-3 text-sm transition-colors"
               [style.color]="currentPath === link.to ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)'"
               [style.background]="currentPath === link.to ? 'var(--bw-bg-active)' : 'transparent'"
               style="border-bottom: 1px solid var(--bw-border-subtle)">
              {{ link.label }}
            </a>
          }
        </div>
      }
    </nav>
  `,
})
export class NavbarComponent {
  cartSvc = inject(CartService);
  wishlistSvc = inject(WishlistService);
  authSvc = inject(AuthService);
  router = inject(Router);

  navLinks = navLinks;
  mobileOpen = false;
  currentPath = '';

  constructor() {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentPath = e.urlAfterRedirects.split('?')[0];
    });
    this.currentPath = this.router.url.split('?')[0];
  }

  handleWishlistClick(): void {
    if (this.authSvc.isAuthenticated()) {
      this.router.navigate(['/wishlist']);
    } else {
      this.router.navigate(['/login'], { queryParams: { from: '/wishlist' } });
    }
  }
}
