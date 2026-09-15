import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { Book } from '../../types';
import { allBooks, sampleOrders } from '../../data/books';
import { CartService } from '../../services/cart.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-recommended-from-history',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    @if (recs.length > 0) {
      <!-- Row layout -->
      @if (layout === 'row') {
        <div class="flex gap-3 overflow-x-auto pb-1" style="scrollbar-width: thin">
          @for (book of recs; track book.id) {
            <div class="shrink-0 w-40 flex flex-col theme-transition"
                 style="background: var(--bw-bg-surface); border: 1px solid var(--bw-border)">
              <div class="w-full h-52 overflow-hidden flex items-center justify-center p-3 text-center cursor-pointer"
                   [style.backgroundColor]="book.coverColor" [style.color]="book.coverTextColor"
                   (click)="router.navigate(['/book', book.id])">
                <div>
                  <p class="font-bold text-[11px] uppercase leading-tight tracking-wide line-clamp-4">{{ book.title }}</p>
                  <div class="w-8 h-px mx-auto my-2 opacity-40" [style.backgroundColor]="book.coverTextColor"></div>
                  <p class="text-[9px] opacity-70">{{ book.author }}</p>
                </div>
              </div>
              <div class="flex flex-col flex-1 px-2.5 pt-2 pb-2.5 gap-0.5">
                <p class="text-primary text-[11px] font-semibold leading-tight line-clamp-2 cursor-pointer hover:text-accent transition-colors"
                   (click)="router.navigate(['/book', book.id])">{{ book.title }}</p>
                <p class="text-muted text-[10px] truncate">by {{ book.author }}</p>
                @if (book.rating) { <div class="mt-0.5"><app-star-rating [rating]="book.rating" size="sm" /></div> }
                <p class="text-muted text-[10px] mt-0.5">{{ book.format }}</p>
                <div class="flex items-center justify-between mt-auto pt-2" style="border-top: 1px solid var(--bw-border-subtle)">
                  <span class="text-primary text-xs font-bold">₹{{ book.price }}</span>
                  <button (click)="cartSvc.addToCart(book)" title="Add to cart"
                          class="flex items-center justify-center transition-colors"
                          style="width:26px;height:26px;background:var(--bw-accent-subtle);border:1px solid var(--bw-accent-border);color:var(--bw-accent)"
                          (mouseenter)="hoverBtn($event,true)" (mouseleave)="hoverBtn($event,false)">
                    <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Column layout -->
      @if (layout === 'col') {
        <div class="bw-card p-4">
          <h3 class="text-primary font-semibold text-sm mb-3">Based on Your Orders</h3>
          <div class="flex flex-col gap-3">
            @for (book of recs; track book.id) {
              <div class="flex gap-3">
                <div class="shrink-0 w-12 h-16 overflow-hidden flex items-center justify-center p-1 text-center cursor-pointer"
                     [style.backgroundColor]="book.coverColor" [style.color]="book.coverTextColor"
                     (click)="router.navigate(['/book', book.id])">
                  <p class="font-bold text-[8px] uppercase leading-tight line-clamp-3">{{ book.title }}</p>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-primary text-xs font-medium line-clamp-2 leading-tight cursor-pointer hover:text-accent transition-colors"
                     (click)="router.navigate(['/book', book.id])">{{ book.title }}</p>
                  <p class="text-muted text-[10px]">by {{ book.author }}</p>
                  @if (book.rating) { <app-star-rating [rating]="book.rating" size="sm" /> }
                  <div class="flex items-center justify-between mt-1.5">
                    <span class="text-primary text-xs font-bold">₹{{ book.price }}</span>
                    <button (click)="cartSvc.addToCart(book)" title="Add to cart"
                            class="flex items-center justify-center transition-colors"
                            style="width:24px;height:24px;background:var(--bw-accent-subtle);border:1px solid var(--bw-accent-border);color:var(--bw-accent)"
                            (mouseenter)="hoverBtn($event,true)" (mouseleave)="hoverBtn($event,false)">
                      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }
    }
  `,
})
export class RecommendedFromHistoryComponent {
  @Input() layout: 'col' | 'row' = 'col';

  router = inject(Router);
  cartSvc = inject(CartService);

  get recs(): Book[] {
    const orderedIds = new Set(sampleOrders.flatMap((o) => o.items.map((i) => i.book.id)));
    const orderedGenres = new Set(sampleOrders.flatMap((o) => o.items.flatMap((i) => i.book.genres)));
    return allBooks
      .filter((b) => !orderedIds.has(b.id) && b.genres.some((g) => orderedGenres.has(g)))
      .slice(0, this.layout === 'row' ? 8 : 4);
  }

  hoverBtn(e: MouseEvent, entering: boolean): void {
    const btn = e.currentTarget as HTMLElement;
    btn.style.background = entering ? 'var(--bw-accent)' : 'var(--bw-accent-subtle)';
    btn.style.color = entering ? 'var(--bw-text-inverse)' : 'var(--bw-accent)';
  }
}
