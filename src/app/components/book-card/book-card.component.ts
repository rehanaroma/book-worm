import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import type { Book } from '../../types';
import { CartService } from '../../services/cart.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule, StarRatingComponent],
  template: `
    <div class="group flex flex-col cursor-pointer overflow-hidden transition-colors theme-transition"
         [style.background]="'var(--bw-bg-surface)'"
         [style.border]="'1px solid var(--bw-border)'"
         (click)="bookClick.emit(book)"
         (mouseenter)="onEnter($event)"
         (mouseleave)="onLeave($event)">
      <!-- Cover -->
      <div class="w-full h-44 flex flex-col items-center justify-center p-3 text-center"
           [style.backgroundColor]="book.coverColor" [style.color]="book.coverTextColor">
        <p class="font-bold text-xs leading-tight uppercase tracking-wide line-clamp-3">{{ book.title }}</p>
        <div class="w-8 h-px my-2 opacity-40" [style.backgroundColor]="book.coverTextColor"></div>
        <p class="text-[10px] opacity-75">{{ book.author }}</p>
      </div>
      <!-- Info -->
      <div class="flex flex-col flex-1 p-3 gap-1">
        <h3 class="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-accent transition-colors"
            style="color: var(--bw-text-primary)">{{ book.title }}</h3>
        <p class="text-xs" style="color: var(--bw-accent)">by {{ book.author }}</p>
        @if (book.rating) {
          <app-star-rating [rating]="book.rating" [count]="book.ratingCount" size="sm" />
        }
        <div class="flex flex-wrap gap-1 mt-0.5">
          @for (g of book.genres.slice(0, 2); track g) {
            <span class="text-[10px] px-1.5 py-0.5"
                  style="background: var(--bw-bg-subtle); color: var(--bw-text-secondary)">{{ g }}</span>
          }
        </div>
        <!-- Price row -->
        <div class="flex items-center justify-between mt-auto pt-2.5" style="border-top: 1px solid var(--bw-border-subtle)">
          <div class="flex items-baseline gap-1.5">
            <span class="font-bold text-sm" style="color: var(--bw-text-primary)">₹{{ book.price }}</span>
            @if (book.originalPrice) {
              <span class="text-xs line-through" style="color: var(--bw-text-muted)">₹{{ book.originalPrice }}</span>
              <span class="text-[10px] font-semibold" style="color: var(--bw-success)">
                {{ getDiscount(book) }}% off
              </span>
            }
          </div>
          <button (click)="addToCart($event)" title="Add to cart"
                  class="flex items-center justify-center transition-colors shrink-0"
                  style="width:28px;height:28px;background:var(--bw-accent-subtle);border:1px solid var(--bw-accent-border);color:var(--bw-accent)"
                  (mouseenter)="onBtnEnter($event)" (mouseleave)="onBtnLeave($event)">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          </button>
        </div>
        <p class="text-[10px]" style="color: var(--bw-text-muted)">Delivery by {{ book.deliveryDate }}</p>
      </div>
    </div>
  `,
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() bookClick = new EventEmitter<Book>();

  private cartSvc = inject(CartService);

  getDiscount(book: Book): number {
    if (!book.originalPrice) return 0;
    return Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100);
  }

  addToCart(e: MouseEvent): void {
    e.stopPropagation();
    this.cartSvc.addToCart(this.book);
  }

  onEnter(e: MouseEvent): void {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = 'var(--bw-accent)';
    el.style.background = 'var(--bw-bg-hover)';
  }
  onLeave(e: MouseEvent): void {
    const el = e.currentTarget as HTMLElement;
    el.style.borderColor = 'var(--bw-border)';
    el.style.background = 'var(--bw-bg-surface)';
  }
  onBtnEnter(e: MouseEvent): void {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    btn.style.background = 'var(--bw-accent)';
    btn.style.color = 'var(--bw-text-inverse)';
  }
  onBtnLeave(e: MouseEvent): void {
    const btn = e.currentTarget as HTMLElement;
    btn.style.background = 'var(--bw-accent-subtle)';
    btn.style.color = 'var(--bw-accent)';
  }
}
