import { Injectable, signal, computed } from '@angular/core';
import type { Book, CartItem } from '../types';

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => this._items().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() => this._items().reduce((sum, i) => sum + i.book.price * i.quantity, 0));

  addToCart(book: Book, qty = 1): void {
    this._items.update((prev) => {
      const existing = prev.find((i) => i.book.id === book.id);
      if (existing) {
        return prev.map((i) => i.book.id === book.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { book, quantity: qty }];
    });
  }

  removeFromCart(bookId: number): void {
    this._items.update((prev) => prev.filter((i) => i.book.id !== bookId));
  }

  updateQty(bookId: number, qty: number): void {
    if (qty <= 0) {
      this.removeFromCart(bookId);
    } else {
      this._items.update((prev) => prev.map((i) => i.book.id === bookId ? { ...i, quantity: qty } : i));
    }
  }

  clearCart(): void {
    this._items.set([]);
  }
}
