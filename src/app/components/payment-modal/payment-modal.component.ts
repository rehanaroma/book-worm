import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { PaymentMethod } from '../../types';

interface Tab { id: PaymentMethod; label: string; }
const TABS: Tab[] = [
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'debit-card', label: 'Debit Card' },
  { id: 'upi', label: 'UPI' },
  { id: 'wallet', label: 'Wallet' },
];

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center px-4" style="background: rgba(0,0,0,0.75)">
      <div class="w-full max-w-2xl overflow-hidden theme-transition"
           style="background: var(--bw-bg-elevated); border: 1px solid var(--bw-border); box-shadow: var(--bw-shadow-lg)">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4" style="border-bottom: 1px solid var(--bw-border)">
          <h2 class="font-bold text-lg" style="color: var(--bw-text-primary)">Complete Payment</h2>
          <div class="flex items-center gap-6">
            <span class="font-bold text-sm" style="color: var(--bw-text-primary)">
              Payable Amount: <span style="color: var(--bw-accent)">₹{{ payableAmount }}</span>
            </span>
            <button (click)="close.emit()" style="color: var(--bw-text-muted)">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex min-h-[280px]">
          <!-- Method tabs -->
          <div class="w-36 shrink-0 py-2" style="border-right: 1px solid var(--bw-border)">
            @for (t of tabs; track t.id) {
              <button (click)="method = t.id" class="w-full text-left px-4 py-3 text-sm transition-colors border-l-2"
                      [style.borderLeftColor]="method === t.id ? 'var(--bw-accent)' : 'transparent'"
                      [style.background]="method === t.id ? 'var(--bw-accent-subtle)' : 'transparent'"
                      [style.color]="method === t.id ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)'"
                      [style.fontWeight]="method === t.id ? '600' : '400'">
                {{ t.label }}
              </button>
            }
          </div>

          <!-- Form -->
          <div class="flex-1 px-6 py-5">
            @if (method === 'credit-card' || method === 'debit-card') {
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="text-xs mb-1 block" style="color: var(--bw-text-secondary)">Card Number</label>
                  <input type="text" placeholder="XXXX-XXXX-XXXX-XXXX" [(ngModel)]="cardNumber"
                         (ngModelChange)="cardNumber = formatCard($event)" class="bw-input" />
                </div>
                <div>
                  <label class="text-xs mb-1 block" style="color: var(--bw-text-secondary)">Name on Card</label>
                  <input type="text" placeholder="Full Name" [(ngModel)]="nameOnCard" class="bw-input" />
                </div>
                <div>
                  <label class="text-xs mb-1 block" style="color: var(--bw-text-secondary)">CVV</label>
                  <input type="password" placeholder="•••" maxlength="4" [(ngModel)]="cvv" class="bw-input" />
                </div>
                <div>
                  <label class="text-xs mb-1 block" style="color: var(--bw-text-secondary)">Date of Expiry</label>
                  <input type="text" placeholder="MM/YYYY" [(ngModel)]="expiry"
                         (ngModelChange)="expiry = formatExpiry($event)" class="bw-input" />
                </div>
              </div>
            }

            @if (method === 'upi') {
              <div class="space-y-4 pt-2">
                <div>
                  <label class="text-xs mb-1 block" style="color: var(--bw-text-secondary)">UPI ID</label>
                  <input type="text" placeholder="yourname@upi" [(ngModel)]="upiId" class="bw-input" />
                </div>
                <p class="text-xs" style="color: var(--bw-text-muted)">You will receive a payment request on your UPI app.</p>
              </div>
            }

            @if (method === 'wallet') {
              <div class="space-y-3 pt-2">
                <p class="text-xs mb-2" style="color: var(--bw-text-secondary)">Select Wallet</p>
                <div class="grid grid-cols-2 gap-2">
                  @for (w of wallets; track w) {
                    <button (click)="selectedWallet = w" class="px-3 py-2 text-sm transition-colors"
                            [style.border]="'1px solid ' + (selectedWallet === w ? 'var(--bw-accent)' : 'var(--bw-border)')"
                            [style.background]="selectedWallet === w ? 'var(--bw-accent-subtle)' : 'var(--bw-bg-subtle)'"
                            [style.color]="selectedWallet === w ? 'var(--bw-accent)' : 'var(--bw-text-secondary)'">
                      {{ w }}
                    </button>
                  }
                </div>
                <p class="text-xs" style="color: var(--bw-text-muted)">Wallet balance will be deducted from {{ selectedWallet }}.</p>
              </div>
            }

            <div class="mt-6 flex justify-end">
              <button (click)="handlePay()" [disabled]="paying"
                      class="flex items-center gap-2 font-bold px-6 py-2.5 transition-colors bw-btn-primary">
                @if (paying) {
                  <span class="w-4 h-4 border-2 animate-spin"
                        style="border-color: rgba(255,255,255,0.3); border-top-color: #fff"></span>
                } @else {
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                }
                {{ paying ? 'Processing…' : 'Pay Now' }}
              </button>
            </div>
          </div>
        </div>

        @if (giftPointsApplied > 0) {
          <div class="px-6 py-3" style="border-top: 1px solid var(--bw-border); background: var(--bw-success-subtle)">
            <p class="text-xs" style="color: var(--bw-success)">
              🎁 Gift points worth ₹{{ giftPointsApplied }} have been applied to this order.
            </p>
          </div>
        }
      </div>
    </div>
  `,
})
export class PaymentModalComponent {
  @Input() payableAmount = 0;
  @Input() giftPointsApplied = 0;
  @Output() pay = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  tabs = TABS;
  method: PaymentMethod = 'credit-card';
  cardNumber = '';
  nameOnCard = '';
  cvv = '';
  expiry = '';
  upiId = '';
  selectedWallet = 'Paytm';
  wallets = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'];
  paying = false;

  formatCard(val: string): string {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1-').replace(/-$/, '');
  }

  formatExpiry(val: string): string {
    const digits = val.replace(/\D/g, '').slice(0, 6);
    return digits.length >= 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits;
  }

  handlePay(): void {
    this.paying = true;
    setTimeout(() => { this.paying = false; this.pay.emit(); }, 1400);
  }
}
