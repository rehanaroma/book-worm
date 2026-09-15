import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (wishlistSvc.items().length === 0) {
      <div class="flex-1 bg-base flex flex-col items-center justify-center gap-4 py-20 theme-transition">
        <svg class="w-14 h-14" style="color: var(--bw-border)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <p class="text-primary font-semibold text-lg">Your wishlist is empty</p>
        <p class="text-secondary text-sm">Save books you love and come back to them anytime.</p>
        <button (click)="router.navigate(['/'])" class="mt-2 bw-btn-primary px-6 py-2.5 text-sm">Browse Books</button>
      </div>
    } @else {
      <div class="flex-1 bg-base overflow-y-auto theme-transition">
        <div class="max-w-5xl mx-auto px-4 py-6">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2.5">
              <svg class="w-5 h-5" style="color: var(--bw-accent)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              <h1 class="text-xl font-bold text-primary">
                My Wishlist
                <span class="ml-2 text-sm font-normal text-secondary">({{ wishlistSvc.items().length }} {{ wishlistSvc.items().length === 1 ? 'book' : 'books' }})</span>
              </h1>
            </div>
            <button (click)="wishlistSvc.clearWishlist()" class="flex items-center gap-1.5 text-xs text-secondary hover:text-danger transition-colors">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
              Clear all
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (book of wishlistSvc.items(); track book.id) {
              <div class="bw-card flex gap-3 p-3 theme-transition">
                <div class="shrink-0 w-20 h-28 overflow-hidden flex items-center justify-center p-2 text-center cursor-pointer"
                     [style.backgroundColor]="book.coverColor" [style.color]="book.coverTextColor"
                     (click)="router.navigate(['/book', book.id])">
                  <div>
                    <p class="font-bold text-[10px] uppercase leading-tight tracking-wide line-clamp-4">{{ book.title }}</p>
                    <div class="w-6 h-px mx-auto my-1.5 opacity-40" [style.backgroundColor]="book.coverTextColor"></div>
                    <p class="text-[8px] opacity-70">{{ book.author }}</p>
                  </div>
                </div>
                <div class="flex flex-col flex-1 min-w-0 py-0.5">
                  <h3 class="text-primary text-sm font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                      (click)="router.navigate(['/book', book.id])">{{ book.title }}</h3>
                  <p class="text-accent text-xs mt-0.5 hover:underline cursor-pointer">by {{ book.author }}</p>
                  <p class="text-muted text-xs mt-0.5">{{ book.format }}</p>
                  <div class="flex flex-wrap gap-x-1.5 mt-0.5">
                    @for (g of book.genres.slice(0,2); track g) {
                      <span class="text-accent text-[10px]">{{ g }}</span>
                    }
                  </div>
                  <div class="flex items-center justify-between mt-auto pt-2" style="border-top: 1px solid var(--bw-border-subtle)">
                    <span class="text-primary font-bold text-sm">₹{{ book.price }}</span>
                    <div class="flex items-center gap-1.5">
                      <button (click)="addAndGo(book)" class="flex items-center gap-1 text-xs bw-btn-primary px-2.5 py-1.5">
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Add
                      </button>
                      <button (click)="wishlistSvc.removeFromWishlist(book.id)" class="flex items-center justify-center w-7 h-7 transition-colors"
                              style="border: 1px solid var(--bw-border); color: var(--bw-text-muted)"
                              (mouseenter)="$any($event.currentTarget).style.borderColor='var(--bw-danger)'; $any($event.currentTarget).style.color='var(--bw-danger)'"
                              (mouseleave)="$any($event.currentTarget).style.borderColor='var(--bw-border)'; $any($event.currentTarget).style.color='var(--bw-text-muted)'">
                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="mt-8 flex justify-center">
            <button (click)="router.navigate(['/'])" class="flex items-center gap-2 bw-btn-outline px-6 py-2.5 text-sm">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class WishlistPageComponent {
  wishlistSvc = inject(WishlistService);
  cartSvc = inject(CartService);
  router = inject(Router);

  addAndGo(book: any): void {
    this.cartSvc.addToCart(book);
    this.router.navigate(['/cart']);
  }
}
