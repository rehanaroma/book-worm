import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { categories } from '../../data/books';
import { PaymentModalComponent } from '../../components/payment-modal/payment-modal.component';
import { OrderConfirmationModalComponent } from '../../components/order-confirmation-modal/order-confirmation-modal.component';
import { RecommendedFromHistoryComponent } from '../../components/recommended-from-history/recommended-from-history.component';
import type { Address, CartItem } from '../../types';

const TAX_RATE = 0.12;
const DELIVERY_THRESHOLD = 500;
const GIFT_POINTS_BALANCE = 250;

const SAVED_ADDRESS: Address = {
  firstName: 'Raj', lastName: 'Kumar',
  addressLine1: '14, MG Road', addressLine2: 'Near City Mall',
  city: 'Bengaluru', state: 'Karnataka', country: 'India',
  pin: '560001', email: 'raj.kumar@email.com', phone: '9876543210',
};

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaymentModalComponent, OrderConfirmationModalComponent, RecommendedFromHistoryComponent],
  template: `
    @if (cartSvc.items().length === 0 && !showConfirmation) {
      <div class="flex-1 bg-base flex flex-col items-center justify-center gap-4 py-20 theme-transition">
        <svg class="w-14 h-14" style="color: var(--bw-border)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <p class="text-primary font-semibold text-xl">Your cart is empty</p>
        <p class="text-secondary text-sm">Add books you love and come back to them anytime.</p>
        <button (click)="router.navigate(['/'])" class="mt-2 bw-btn-primary px-6 py-2.5 text-sm">Browse Books</button>
      </div>
    }

    @if (cartSvc.items().length > 0) {
      <div class="flex-1 bg-base overflow-y-auto theme-transition">
        <div class="max-w-6xl mx-auto px-4 py-6">
          <!-- Auth banner (guest/unauthenticated) -->
          @if (!authSvc.isAuthenticated()) {
            <div class="mb-5 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between"
                 style="background: var(--bw-accent-subtle); border: 1px solid var(--bw-accent-border)">
              <p class="text-sm" style="color: var(--bw-text-secondary)">
                <span class="font-semibold" style="color: var(--bw-text-primary)">Sign in</span> to save your cart, track orders, and use gift points.
              </p>
              <div class="flex gap-2 shrink-0">
                <button (click)="router.navigate(['/login'], {queryParams: {from: '/cart', reason: 'checkout'}})"
                        class="flex items-center gap-1.5 text-xs bw-btn-primary px-3 py-2">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Sign In
                </button>
                <button (click)="router.navigate(['/login'], {queryParams: {from: '/cart', reason: 'checkout', tab: 'register'}})"
                        class="flex items-center gap-1.5 text-xs bw-btn-outline px-3 py-2">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  Register
                </button>
              </div>
            </div>
          }

          <div class="flex flex-col lg:flex-row gap-6">
            <!-- Cart items + address -->
            <div class="flex-1 min-w-0 flex flex-col gap-5">
              <!-- Cart items -->
              <div class="bw-card p-5">
                <h1 class="text-primary font-bold text-xl mb-1">Shopping Cart</h1>
                <p class="text-secondary text-sm mb-4">{{ cartSvc.totalItems() }} item{{ cartSvc.totalItems() !== 1 ? 's' : '' }}</p>
                <div>
                  @for (item of cartSvc.items(); track item.book.id) {
                    <div class="flex gap-4 py-5 border-b border-base last:border-0">
                      <div class="shrink-0 w-24 h-32 overflow-hidden flex items-center justify-center p-2 text-center cursor-pointer shadow-md"
                           [style.backgroundColor]="item.book.coverColor" [style.color]="item.book.coverTextColor"
                           (click)="router.navigate(['/book', item.book.id])">
                        <div>
                          <p class="font-bold text-[10px] uppercase leading-tight tracking-wide line-clamp-4">{{ item.book.title }}</p>
                          <p class="text-[8px] mt-1 opacity-75">{{ item.book.author }}</p>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <h3 class="text-primary font-semibold text-base leading-tight cursor-pointer hover:text-accent transition-colors"
                            (click)="router.navigate(['/book', item.book.id])">{{ item.book.title }}</h3>
                        <p class="text-accent text-xs mt-0.5">by {{ item.book.author }}</p>
                        <p class="text-secondary text-xs mt-1 line-clamp-2">{{ item.book.description }}</p>
                        <p class="text-muted text-xs mt-1">{{ item.book.format }}</p>
                        <div class="flex items-center gap-4 mt-3">
                          <p class="text-primary font-bold text-lg">₹{{ item.book.price }}</p>
                          <p class="text-muted text-xs">Delivery by {{ item.book.deliveryDate }}</p>
                        </div>
                        <div class="flex items-center gap-2 mt-2">
                          <button (click)="cartSvc.updateQty(item.book.id, item.quantity - 1)"
                                  class="w-7 h-7 flex items-center justify-center border border-base text-secondary hover:text-primary transition-colors">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                          <span class="text-primary font-medium text-sm w-6 text-center">{{ item.quantity }}</span>
                          <button (click)="cartSvc.updateQty(item.book.id, item.quantity + 1)"
                                  class="w-7 h-7 flex items-center justify-center border border-base text-secondary hover:text-primary transition-colors">
                            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                          <button (click)="cartSvc.removeFromCart(item.book.id)"
                                  class="ml-2 flex items-center gap-1 text-danger hover:opacity-80 text-xs transition-colors">
                            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Address form -->
              <div class="bw-card p-5">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-primary font-bold text-base">Address</h2>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="useSaved" class="w-4 h-4 accent-blue-500" />
                    <span class="text-secondary text-sm">Use Saved Address</span>
                  </label>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div><label class="text-secondary text-xs mb-1 block">First Name</label><input class="bw-input" placeholder="First Name" [disabled]="useSaved" [(ngModel)]="addr.firstName" /></div>
                  <div><label class="text-secondary text-xs mb-1 block">Last Name</label><input class="bw-input" placeholder="Last Name" [disabled]="useSaved" [(ngModel)]="addr.lastName" /></div>
                  <div><label class="text-secondary text-xs mb-1 block">Address</label><input class="bw-input" placeholder="Address Line 1" [disabled]="useSaved" [(ngModel)]="addr.addressLine1" /></div>
                  <div><label class="text-secondary text-xs mb-1 block">&nbsp;</label><input class="bw-input" placeholder="Address Line 2" [disabled]="useSaved" [(ngModel)]="addr.addressLine2" /></div>
                  <div><label class="text-secondary text-xs mb-1 block">e-mail</label><input type="email" class="bw-input" placeholder="e-mail" [disabled]="useSaved" [(ngModel)]="addr.email" /></div>
                  <div><label class="text-secondary text-xs mb-1 block">City</label><input class="bw-input" placeholder="City" [disabled]="useSaved" [(ngModel)]="addr.city" /></div>
                  <div><label class="text-secondary text-xs mb-1 block">Pin</label><input class="bw-input" placeholder="000000" [disabled]="useSaved" [(ngModel)]="addr.pin" /></div>
                  <div>
                    <label class="text-secondary text-xs mb-1 block">Phone Number</label>
                    <div class="flex gap-2">
                      <div class="bg-subtle border border-base px-2.5 py-2.5 text-secondary text-sm shrink-0">+91</div>
                      <input type="tel" class="bw-input" placeholder="12345567890" [disabled]="useSaved" [(ngModel)]="addr.phone" />
                    </div>
                  </div>
                  <div><label class="text-secondary text-xs mb-1 block">State</label><input class="bw-input" placeholder="State" [disabled]="useSaved" [(ngModel)]="addr.state" /></div>
                  <div>
                    <label class="text-secondary text-xs mb-1 block">Country</label>
                    <select class="bw-input" [disabled]="useSaved" [(ngModel)]="addr.country">
                      <option>India</option><option>United States</option><option>United Kingdom</option><option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order summary -->
            <div class="w-full lg:w-80 shrink-0 flex flex-col gap-4">
              <div class="bw-card p-5 flex flex-col gap-3">
                <h2 class="text-primary font-bold text-base">Order Summary</h2>

                <!-- Gift points -->
                @if (authSvc.isAuthenticated()) {
                  <div class="flex items-center justify-between p-3 cursor-pointer"
                       style="background: var(--bw-success-subtle); border: 1px solid var(--bw-success-border)"
                       (click)="giftApplied = !giftApplied">
                    <div class="flex items-center gap-2">
                      <svg class="w-4 h-4" style="color: var(--bw-success)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
                        <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                      </svg>
                      <div>
                        <p class="text-xs font-semibold" style="color: var(--bw-success)">{{ GIFT_POINTS_BALANCE }} Gift Points</p>
                        <p class="text-[10px]" style="color: var(--bw-text-muted)">≈ ₹{{ GIFT_POINTS_BALANCE }} discount</p>
                      </div>
                    </div>
                    <input type="checkbox" [checked]="giftApplied" class="w-4 h-4 accent-green-500 pointer-events-none" />
                  </div>
                }

                <!-- Coupon -->
                <div>
                  <label class="text-secondary text-xs mb-1.5 block">Coupon Code</label>
                  <div class="flex gap-2">
                    <div class="relative flex-1">
                      <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style="color: var(--bw-text-muted)"
                           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                        <line x1="7" y1="7" x2="7.01" y2="7"/>
                      </svg>
                      <input type="text" placeholder="Enter code" [(ngModel)]="coupon" class="bw-input pl-8 text-sm py-2" />
                    </div>
                    <button (click)="applyCoupon()" class="bw-btn-outline px-3 py-2 text-xs">Apply</button>
                  </div>
                  @if (couponDiscount > 0) {
                    <p class="text-success text-xs mt-1">Coupon applied! You save ₹{{ couponDiscount }}</p>
                  }
                </div>

                <!-- Breakdown -->
                <div class="space-y-2 pt-2" style="border-top: 1px solid var(--bw-border-subtle)">
                  <div class="flex justify-between text-sm"><span class="text-secondary">Subtotal ({{ cartSvc.totalItems() }} items)</span><span class="text-primary">₹{{ cartSvc.subtotal() }}</span></div>
                  <div class="flex justify-between text-sm"><span class="text-secondary">Tax (12%)</span><span class="text-primary">₹{{ tax }}</span></div>
                  <div class="flex justify-between text-sm">
                    <span class="text-secondary">Delivery</span>
                    @if (delivery === 0) { <span class="text-success text-xs font-medium">FREE</span> }
                    @else { <span class="text-primary">₹{{ delivery }}</span> }
                  </div>
                  @if (couponDiscount > 0) {
                    <div class="flex justify-between text-sm"><span class="text-success">Coupon Discount</span><span class="text-success">-₹{{ couponDiscount }}</span></div>
                  }
                  @if (giftDiscount > 0) {
                    <div class="flex justify-between text-sm"><span class="text-success">Gift Points</span><span class="text-success">-₹{{ giftDiscount }}</span></div>
                  }
                </div>

                <div class="flex justify-between items-center pt-3" style="border-top: 2px solid var(--bw-border)">
                  <span class="font-bold text-base text-primary">Total</span>
                  <span class="font-bold text-xl text-primary">₹{{ total }}</span>
                </div>

                <button (click)="handlePayNow()" class="w-full bw-btn-primary justify-center py-3 text-base mt-1">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Pay Now
                </button>
              </div>

              <app-recommended-from-history layout="col" />
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Payment modal -->
    @if (showPayment) {
      <app-payment-modal
        [payableAmount]="total"
        [giftPointsApplied]="giftDiscount"
        (pay)="handlePaymentComplete()"
        (close)="showPayment = false"
      />
    }

    <!-- Confirmation modal -->
    @if (showConfirmation) {
      <app-order-confirmation-modal
        [items]="confirmedItems"
        [orderId]="orderId"
        (continueShopping)="handleContinue()"
      />
    }
  `,
})
export class CartPageComponent {
  cartSvc = inject(CartService);
  authSvc = inject(AuthService);
  router = inject(Router);

  GIFT_POINTS_BALANCE = GIFT_POINTS_BALANCE;
  useSaved = false;
  addr: Address = { ...SAVED_ADDRESS };
  coupon = '';
  couponDiscount = 0;
  giftApplied = false;
  showPayment = false;
  showConfirmation = false;
  confirmedItems: CartItem[] = [];
  orderId = '';

  get tax(): number { return Math.round(this.cartSvc.subtotal() * TAX_RATE); }
  get delivery(): number { return this.cartSvc.subtotal() >= DELIVERY_THRESHOLD ? 0 : 40; }
  get giftDiscount(): number { return this.giftApplied ? Math.min(GIFT_POINTS_BALANCE, this.cartSvc.subtotal()) : 0; }
  get total(): number { return this.cartSvc.subtotal() + this.tax + this.delivery - this.couponDiscount - this.giftDiscount; }

  applyCoupon(): void {
    if (this.coupon.toUpperCase() === 'BOOKWORM10') {
      this.couponDiscount = Math.round(this.cartSvc.subtotal() * 0.10);
    } else if (this.coupon.toUpperCase() === 'SAVE50') {
      this.couponDiscount = 50;
    } else {
      this.couponDiscount = 0;
    }
  }

  handlePayNow(): void {
    if (!this.authSvc.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { from: '/cart', reason: 'checkout' } });
      return;
    }
    this.showPayment = true;
  }

  handlePaymentComplete(): void {
    this.confirmedItems = [...this.cartSvc.items()];
    this.orderId = `ORD-${Date.now().toString().slice(-5)}`;
    this.showPayment = false;
    this.cartSvc.clearCart();
    this.showConfirmation = true;
  }

  handleContinue(): void {
    this.showConfirmation = false;
    this.router.navigate(['/']);
  }
}
