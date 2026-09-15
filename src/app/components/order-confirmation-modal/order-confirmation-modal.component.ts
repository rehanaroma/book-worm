import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { CartItem } from '../../types';

@Component({
  selector: 'app-order-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background: rgba(0,0,0,0.75)">
      <div class="w-full max-w-2xl overflow-hidden theme-transition"
           style="background: var(--bw-bg-elevated); border: 1px solid var(--bw-border); box-shadow: var(--bw-shadow-lg)">
        <!-- Header -->
        <div class="flex flex-col items-center pt-8 pb-5 px-6">
          <div class="w-14 h-14 flex items-center justify-center mb-4"
               style="background: var(--bw-success); box-shadow: 0 0 20px rgba(63,185,80,0.4)">
            <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-center leading-snug" style="color: var(--bw-text-primary)">
            Your purchase of the<br />following reads is successful
          </h2>
          <p class="text-xs mt-2" style="color: var(--bw-text-muted)">Order ID: {{ orderId }}</p>
        </div>

        <!-- Books -->
        <div class="px-6 pb-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            @for (item of items; track item.book.id) {
              <div class="flex gap-3">
                <div class="shrink-0 w-24 h-32 overflow-hidden flex items-center justify-center p-2 text-center"
                     [style.backgroundColor]="item.book.coverColor" [style.color]="item.book.coverTextColor"
                     style="box-shadow: var(--bw-shadow-md)">
                  <div>
                    <p class="font-bold text-[11px] uppercase leading-tight tracking-wide line-clamp-3">{{ item.book.title }}</p>
                    <p class="text-[9px] mt-1 opacity-70">{{ item.book.author }}</p>
                  </div>
                </div>
                <div class="flex-1 min-w-0 py-1">
                  <h3 class="font-semibold text-sm leading-tight" style="color: var(--bw-text-primary)">{{ item.book.title }}</h3>
                  <p class="text-xs mt-0.5" style="color: var(--bw-accent)">by {{ item.book.author }}</p>
                  <p class="text-xs mt-1 line-clamp-2" style="color: var(--bw-text-secondary)">{{ item.book.description }}</p>
                  <p class="text-xs mt-1" style="color: var(--bw-text-muted)">{{ item.book.format }}</p>
                  <div class="flex flex-wrap gap-x-1.5 mt-0.5">
                    @for (g of item.book.genres.slice(0,2); track g) {
                      <span class="text-[11px]" style="color: var(--bw-accent)">{{ g }}</span>
                    }
                  </div>
                  <p class="font-bold text-sm mt-1.5" style="color: var(--bw-text-primary)">
                    ₹{{ item.book.price }}{{ item.quantity > 1 ? ' × ' + item.quantity : '' }}
                  </p>
                  <p class="text-[11px]" style="color: var(--bw-text-muted)">Delivery by {{ item.book.deliveryDate }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- CTA -->
        <div class="px-6 pb-7 flex justify-center">
          <button (click)="continueShopping.emit()" class="flex items-center gap-2 font-bold px-8 py-2.5 transition-colors bw-btn-primary">
            Continue your Shopping
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class OrderConfirmationModalComponent {
  @Input() items: CartItem[] = [];
  @Input() orderId = '';
  @Output() continueShopping = new EventEmitter<void>();
}
