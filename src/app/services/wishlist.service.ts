import { Injectable, signal, computed, effect } from '@angular/core';
import type { Book } from '../types';
import { AuthService } from './auth.service';

const STORAGE_PREFIX = 'bw_wishlist_';

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

function loadForUser(userId: string): Book[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as Book[]) : [];
  } catch { return []; }
}

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private _items = signal<Book[]>([]);

  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => this._items().length);

  constructor(private authService: AuthService) {
    effect(() => {
      const isAuth = this.authService.isAuthenticated();
      const user = this.authService.user();
      if (isAuth && user) {
        this._items.set(loadForUser(user.id));
      } else {
        this._items.set([]);
      }
    });

    effect(() => {
      const isAuth = this.authService.isAuthenticated();
      const user = this.authService.user();
      const items = this._items();
      if (isAuth && user) {
        localStorage.setItem(storageKey(user.id), JSON.stringify(items));
      }
    });
  }

  isWishlisted(bookId: number): boolean {
    if (!this.authService.isAuthenticated()) return false;
    return this._items().some((b) => b.id === bookId);
  }

  /** Returns false if not authenticated (caller should redirect to login) */
  toggleWishlist(book: Book): boolean {
    if (!this.authService.isAuthenticated()) return false;
    this._items.update((prev) =>
      prev.some((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book]
    );
    return true;
  }

  removeFromWishlist(bookId: number): void {
    if (!this.authService.isAuthenticated()) return;
    this._items.update((prev) => prev.filter((b) => b.id !== bookId));
  }

  clearWishlist(): void {
    if (!this.authService.isAuthenticated()) return;
    this._items.set([]);
  }
}
