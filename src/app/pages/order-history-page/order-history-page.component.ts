import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { sampleOrders } from '../../data/books';
import type { Order, OrderItem } from '../../types';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-order-history-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex-1 overflow-y-auto bg-base px-4 py-6 theme-transition">
      <div class="mb-6">
        <h1 class="text-2xl font-bold" style="color: var(--bw-text-primary)">My Orders</h1>
        <p class="text-sm mt-1" style="color: var(--bw-text-secondary)">{{ orders.length }} orders in your history</p>
      </div>
      <div class="flex flex-col gap-4 max-w-3xl">
        @for (order of orders; track order.id) {
          <div class="overflow-hidden bw-card">
            <div class="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <svg class="w-5 h-5 shrink-0" style="color: var(--bw-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-bold text-sm" style="color: var(--bw-text-primary)">{{ order.id }}</span>
                    <span class="flex items-center gap-1 text-xs font-medium px-2 py-0.5"
                          [style.color]="getStatusColor(order.status)"
                          [style.background]="getStatusSubtle(order.status)"
                          [style.border]="'1px solid ' + getStatusBorder(order.status)">
                      {{ order.status }}
                    </span>
                  </div>
                  <p class="text-xs mt-0.5" style="color: var(--bw-text-muted)">
                    Ordered on {{ order.date }}{{ order.deliveredOn ? ' · Delivered ' + order.deliveredOn : '' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-xs" style="color: var(--bw-text-muted)">{{ order.items.length }} item{{ order.items.length > 1 ? 's' : '' }}</p>
                  <p class="font-bold text-sm" style="color: var(--bw-text-primary)">₹{{ order.total }}</p>
                </div>
                <button (click)="toggleOrder(order.id)" class="p-1.5 transition-colors" style="color: var(--bw-text-secondary)">
                  <svg class="w-4 h-4 transition-transform" [class.rotate-180]="expandedOrders.has(order.id)"
                       viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
              </div>
            </div>

            @if (expandedOrders.has(order.id)) {
              <div class="px-4 pt-1 pb-3" style="border-top: 1px solid var(--bw-border)">
                @for (item of order.items; track item.book.id) {
                  <div class="flex items-center gap-3 py-3" style="border-bottom: 1px solid var(--bw-border-subtle)">
                    <div class="shrink-0 w-12 h-16 overflow-hidden flex items-center justify-center p-1 text-center text-[9px] font-bold uppercase leading-tight"
                         [style.backgroundColor]="item.book.coverColor" [style.color]="item.book.coverTextColor">
                      {{ item.book.title }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium line-clamp-2 leading-tight" style="color: var(--bw-text-primary)">{{ item.book.title }}</p>
                      <p class="text-xs mt-0.5" style="color: var(--bw-text-secondary)">by {{ item.book.author }}</p>
                      <p class="text-xs" style="color: var(--bw-text-muted)">{{ item.book.format }} · Qty: {{ item.quantity }}</p>
                    </div>
                    <div class="flex flex-col items-end gap-2 shrink-0">
                      <span class="text-sm font-semibold" style="color: var(--bw-text-primary)">₹{{ item.priceAtPurchase }}</span>
                      <button (click)="buyAgain(item)" class="flex items-center gap-1.5 text-xs px-3 py-1.5 transition-colors bw-btn-outline">
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        Buy Again
                      </button>
                    </div>
                  </div>
                }
                <div class="flex justify-between items-center pt-3 mt-1">
                  <span class="text-sm" style="color: var(--bw-text-secondary)">Order Total</span>
                  <span class="font-bold text-base" style="color: var(--bw-text-primary)">₹{{ order.total }}</span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class OrderHistoryPageComponent {
  router = inject(Router);
  cartSvc = inject(CartService);

  orders = sampleOrders;
  expandedOrders = new Set<string>();

  toggleOrder(id: string): void {
    if (this.expandedOrders.has(id)) this.expandedOrders.delete(id);
    else this.expandedOrders.add(id);
  }

  buyAgain(item: OrderItem): void {
    this.cartSvc.addToCart(item.book, item.quantity);
    this.router.navigate(['/cart']);
  }

  getStatusColor(status: Order['status']): string {
    const map: Record<Order['status'], string> = {
      Delivered: 'var(--bw-success)', Shipped: 'var(--bw-accent)',
      Processing: 'var(--bw-warning)', Cancelled: 'var(--bw-danger)',
    };
    return map[status];
  }
  getStatusSubtle(status: Order['status']): string {
    const map: Record<Order['status'], string> = {
      Delivered: 'var(--bw-success-subtle)', Shipped: 'var(--bw-accent-subtle)',
      Processing: 'var(--bw-warning-subtle)', Cancelled: 'var(--bw-danger-subtle)',
    };
    return map[status];
  }
  getStatusBorder(status: Order['status']): string {
    const map: Record<Order['status'], string> = {
      Delivered: 'var(--bw-success-border)', Shipped: 'var(--bw-accent-border)',
      Processing: 'rgba(245,197,24,0.35)', Cancelled: 'var(--bw-danger-border)',
    };
    return map[status];
  }
}
