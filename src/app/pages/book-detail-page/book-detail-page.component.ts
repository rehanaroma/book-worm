import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { allBooks, publishers, categories } from '../../data/books';
import type { Book, Review } from '../../types';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

const AUTHOR_BIOS: Record<string, { bio: string; avatar: string }> = {
  'Arjun Patel': { bio: 'Arjun Patel is a productivity coach and bestselling author based in Mumbai. With over a decade of experience helping professionals cut through distraction, his work has helped thousands achieve more in less time.', avatar: 'AP' },
  'Daniel Reed': { bio: 'Daniel Reed is a writer, minimalist, and productivity coach based in San Francisco. With a passion for intentional living, he has dedicated his career to helping individuals simplify their lives — one habit, one space, and one thought at a time.', avatar: 'DR' },
  'James Wright': { bio: 'James Wright is an executive coach and author known for his pragmatic approach to goal-setting. He has coached Fortune 500 leaders and first-generation entrepreneurs alike.', avatar: 'JW' },
};

const SAMPLE_REVIEWS: Review[] = [
  { id: 'r1', author: 'John Smith', rating: 5, text: 'Absolutely loved this book! The insights changed my perspective on how I approach work every day.', date: '12 Jul 2025' },
  { id: 'r2', author: 'Priya M.', rating: 4, text: 'A refreshing and practical read. The exercises at the end of each chapter are particularly useful.', date: '5 Jul 2025' },
];

@Component({
  selector: 'app-book-detail-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (book) {
      <div class="flex-1 overflow-y-auto bg-base">
        <div class="max-w-7xl mx-auto px-4 pt-4 pb-10">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-1.5 text-xs text-muted mb-4 flex-wrap">
            <a routerLink="/" class="text-accent hover:underline">Home</a>
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <a [routerLink]="['/catalogue', book.categoryId]" class="text-accent hover:underline">{{ catName }}</a>
            @if (book.genres[0]) {
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span class="text-accent cursor-pointer hover:underline">{{ book.genres[0] }}</span>
            }
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span class="text-secondary truncate max-w-[180px]">{{ book.title }}</span>
          </nav>

          <div class="flex flex-col lg:flex-row gap-8">
            <!-- Left column -->
            <div class="flex-1 min-w-0">
              <div class="flex flex-col sm:flex-row gap-6">
                <!-- Cover -->
                <div class="shrink-0 w-full sm:w-52 lg:w-64">
                  <div class="w-full sm:w-52 lg:w-64 aspect-[2/3] overflow-hidden shadow-2xl flex flex-col items-center justify-center p-4 text-center"
                       [style.backgroundColor]="book.coverColor" [style.color]="book.coverTextColor">
                    <p class="font-bold text-base leading-tight uppercase tracking-wide">{{ book.title }}</p>
                    <div class="w-12 h-px my-3 opacity-40" [style.backgroundColor]="book.coverTextColor"></div>
                    <p class="text-sm opacity-80">{{ book.author }}</p>
                  </div>
                  <div class="flex flex-col gap-2 mt-4">
                    <button (click)="handleAddToCart()" [class]="'w-full justify-center py-2.5 text-sm ' + (addedToCart ? 'bw-btn-outline' : 'bw-btn-primary')">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                      </svg>
                      {{ addedToCart ? 'Added to Cart!' : 'Add to Cart' }}
                    </button>
                    <button (click)="handleToggleWishlist()" class="w-full bw-btn-outline justify-center py-2.5 text-sm"
                            [style.color]="wishlisted ? 'var(--bw-danger)' : ''"
                            [style.borderColor]="wishlisted ? 'var(--bw-danger)' : ''">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                           [attr.fill]="wishlisted ? 'currentColor' : 'none'">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                      {{ wishlisted ? 'Wishlisted' : 'Add to Wishlist' }}
                    </button>
                  </div>
                </div>

                <!-- Details -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap gap-2 mb-3">
                    @if (book.badge) {
                      <span class="text-[11px] font-bold px-2 py-0.5" style="background-color: var(--bw-action); color: var(--bw-text-inverse)">{{ book.badge }}</span>
                    }
                    <span class="bg-subtle text-secondary text-[11px] px-2 py-0.5">{{ book.format }}</span>
                  </div>
                  <h1 class="text-primary text-2xl md:text-3xl font-bold leading-tight">{{ book.title }}</h1>
                  <p class="text-accent text-sm mt-1 hover:underline cursor-pointer">by {{ book.author }}</p>
                  @if (book.description) {
                    <p class="text-secondary text-sm mt-3 leading-relaxed">{{ book.description }}</p>
                  }
                  @if (publisher) {
                    <p class="text-secondary text-sm mt-2">Published by: <span class="text-accent hover:underline cursor-pointer">{{ publisher.name }}</span></p>
                  }
                  <div class="flex items-baseline gap-3 mt-4">
                    <span class="text-primary text-3xl font-bold">₹{{ book.price }}</span>
                    @if (book.originalPrice) {
                      <span class="text-muted text-lg line-through">₹{{ book.originalPrice }}</span>
                      <span class="text-success font-semibold text-sm">{{ getDiscount() }}% off</span>
                    }
                  </div>
                  <p class="text-secondary text-sm mt-1">Delivery by <span class="text-primary font-medium">{{ book.deliveryDate }}</span></p>
                </div>
              </div>

              <!-- Author bio -->
              @if (authorInfo) {
                <div class="mt-8">
                  <h2 class="text-primary font-bold text-base mb-3">About the writer</h2>
                  <div class="flex gap-4">
                    <div class="shrink-0 w-16 h-16 bg-accent flex items-center justify-center font-bold text-lg shadow-md" style="color: var(--bw-text-inverse)">
                      {{ authorInfo.avatar }}
                    </div>
                    <div>
                      <p class="text-primary font-semibold text-sm">{{ book.author }}</p>
                      <p class="text-secondary text-sm mt-1 leading-relaxed">{{ authorInfo.bio }}</p>
                    </div>
                  </div>
                </div>
              }

              <!-- Metadata grid -->
              <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                @if (book.pages) {
                  <div class="flex items-center gap-2 bg-subtle p-3">
                    <svg class="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    <div><p class="text-muted text-[10px] uppercase tracking-wide">Pages</p><p class="text-primary text-sm font-medium">{{ book.pages }}</p></div>
                  </div>
                }
                @if (book.language) {
                  <div class="flex items-center gap-2 bg-subtle p-3">
                    <svg class="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <div><p class="text-muted text-[10px] uppercase tracking-wide">Language</p><p class="text-primary text-sm font-medium">{{ book.language }}</p></div>
                  </div>
                }
                @if (publisher) {
                  <div class="flex items-center gap-2 bg-subtle p-3">
                    <div class="w-6 h-6 flex items-center justify-center text-white text-[9px] font-bold shrink-0" [style.backgroundColor]="publisher.logoColor">
                      {{ publisher.logoText.charAt(0) }}
                    </div>
                    <div><p class="text-muted text-[10px] uppercase tracking-wide">Publisher</p><p class="text-primary text-sm font-medium leading-tight">{{ publisher.name }}</p></div>
                  </div>
                }
                @if (book.isbn) {
                  <div class="flex items-center gap-2 bg-subtle p-3">
                    <svg class="w-4 h-4 text-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
                    <div><p class="text-muted text-[10px] uppercase tracking-wide">ISBN</p><p class="text-primary text-xs font-mono leading-tight">{{ book.isbn }}</p></div>
                  </div>
                }
              </div>

              <!-- Reviews -->
              <div class="mt-8">
                <h2 class="text-primary font-bold text-base mb-4">Reviews</h2>
                <div class="mb-5">
                  <div class="flex items-center justify-between mb-1">
                    <label class="text-secondary text-xs">Leave Your Review</label>
                    <span class="text-muted text-xs">{{ reviewText.length }}/100</span>
                  </div>
                  <textarea placeholder="Placeholder text" maxlength="100" [(ngModel)]="reviewText" rows="4" class="bw-input resize-none"></textarea>
                  <div class="flex items-center justify-between mt-2">
                    <div class="flex gap-1">
                      @for (i of [1,2,3,4,5]; track i) {
                        <button (mouseenter)="hoverRating = i" (mouseleave)="hoverRating = 0" (click)="reviewRating = i">
                          <svg class="w-5 h-5 transition-colors" [class]="i <= (hoverRating || reviewRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted'"
                               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        </button>
                      }
                    </div>
                    <button (click)="submitReview()" class="bw-btn-primary px-5 py-2">
                      Submit
                      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                  </div>
                </div>
                @for (r of reviews; track r.id) {
                  <div class="py-4 border-b border-base last:border-0">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-primary font-medium text-sm">{{ r.author }}</span>
                      <span class="text-muted text-xs">{{ r.date }}</span>
                    </div>
                    <p class="text-secondary text-sm leading-relaxed">{{ r.text }}</p>
                    <div class="flex mt-2">
                      @for (i of [1,2,3,4,5]; track i) {
                        <svg class="w-3.5 h-3.5" [class]="i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'"
                             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Right column: related reads -->
            <div class="w-full lg:w-64 xl:w-72 shrink-0">
              <div class="sticky top-4">
                <h2 class="text-primary font-bold text-base mb-3">Related Reads</h2>
                <div class="flex flex-col gap-3">
                  @for (related of relatedBooks; track related.id) {
                    <div class="flex gap-3 cursor-pointer group" (click)="router.navigate(['/book', related.id])">
                      <div class="shrink-0 w-16 h-20 overflow-hidden flex items-center justify-center p-1 text-center shadow"
                           [style.backgroundColor]="related.coverColor" [style.color]="related.coverTextColor">
                        <p class="font-bold text-[8px] uppercase leading-tight line-clamp-4">{{ related.title }}</p>
                      </div>
                      <div class="flex-1 min-w-0 py-0.5">
                        <p class="text-primary text-xs font-semibold leading-tight line-clamp-2 group-hover:text-accent transition-colors">{{ related.title }}</p>
                        <p class="text-accent text-[11px] mt-0.5">by {{ related.author }}</p>
                        <p class="text-muted text-[10px] mt-0.5 line-clamp-2">{{ related.description }}</p>
                        <p class="text-primary font-bold text-xs mt-1">₹{{ related.price }}</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center min-h-[50vh] text-muted gap-3">
        <p class="text-lg">Book not found.</p>
        <button (click)="router.navigate(['/'])" class="text-accent text-sm hover:underline">← Go back</button>
      </div>
    }
  `,
})
export class BookDetailPageComponent {
  @Input() set bookId(id: string) {
    this._bookId = Number(id);
    this._initBook();
  }

  router = inject(Router);
  cartSvc = inject(CartService);
  wishlistSvc = inject(WishlistService);

  private _bookId = 0;
  book: Book | undefined;
  publisher: any;
  catName = '';
  authorInfo: any;
  relatedBooks: Book[] = [];
  wishlisted = false;
  addedToCart = false;
  reviews = [...SAMPLE_REVIEWS];
  reviewText = '';
  reviewRating = 0;
  hoverRating = 0;
  discount: number | null = null;

  private _initBook(): void {
    this.book = allBooks.find((b) => b.id === this._bookId);
    if (!this.book) return;
    this.publisher = publishers.find((p) => p.id === this.book!.publisherId);
    this.catName = categories.find((c) => c.id === this.book!.categoryId)?.name ?? 'Books';
    this.discount = this.book.originalPrice ? Math.round(((this.book.originalPrice - this.book.price) / this.book.originalPrice) * 100) : null;
    this.authorInfo = AUTHOR_BIOS[this.book.author];
    this.wishlisted = this.wishlistSvc.isWishlisted(this.book.id);
    this.relatedBooks = allBooks
      .filter((b) => b.id !== this.book!.id && (b.categoryId === this.book!.categoryId || b.genres.some((g) => this.book!.genres.includes(g))))
      .slice(0, 5);
  }

  getDiscount(): number { return this.discount ?? 0; }

  handleAddToCart(): void {
    if (!this.book) return;
    this.cartSvc.addToCart(this.book);
    this.addedToCart = true;
    setTimeout(() => this.addedToCart = false, 2000);
  }

  handleToggleWishlist(): void {
    if (!this.book) return;
    const performed = this.wishlistSvc.toggleWishlist(this.book);
    if (!performed) {
      this.router.navigate(['/login'], { queryParams: { from: `/book/${this.book.id}` } });
    } else {
      this.wishlisted = this.wishlistSvc.isWishlisted(this.book.id);
    }
  }

  submitReview(): void {
    if (!this.reviewText.trim() || this.reviewRating === 0) return;
    this.reviews = [{ id: `r${Date.now()}`, author: 'You', rating: this.reviewRating, text: this.reviewText, date: 'Just now' }, ...this.reviews];
    this.reviewText = '';
    this.reviewRating = 0;
  }
}
