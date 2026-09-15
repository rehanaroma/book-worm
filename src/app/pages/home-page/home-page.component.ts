import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FilterBarComponent, FilterState, DEFAULT_FILTERS } from '../../components/filter-bar/filter-bar.component';
import { BookSectionComponent } from '../../components/book-section/book-section.component';
import { BrandBrowserComponent } from '../../components/brand-browser/brand-browser.component';
import { RecommendedFromHistoryComponent } from '../../components/recommended-from-history/recommended-from-history.component';
import { allBooks, recommendedBooks, bestsellerBooks, newLaunchBooks } from '../../data/books';
import { AuthService } from '../../services/auth.service';
import type { Book } from '../../types';

function applyFilters(books: Book[], filters: FilterState): Book[] {
  let result = books;
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.genres.some((g) => g.toLowerCase().includes(q)));
  }
  if (filters.language !== 'All') result = result.filter((b) => b.language === filters.language);
  if (filters.format !== 'All') result = result.filter((b) => b.format === filters.format);
  if (filters.priceRange !== 'All') {
    result = result.filter((b) => {
      const p = b.price;
      switch (filters.priceRange) {
        case 'Under ₹100': return p < 100;
        case '₹100–₹300': return p >= 100 && p <= 300;
        case '₹300–₹500': return p > 300 && p <= 500;
        case 'Above ₹500': return p > 500;
        default: return true;
      }
    });
  }
  switch (filters.sortBy) {
    case 'Price: Low to High': result = [...result].sort((a, b) => a.price - b.price); break;
    case 'Price: High to Low': result = [...result].sort((a, b) => b.price - a.price); break;
    case 'Newest': result = [...result].sort((a, b) => b.id - a.id); break;
    case 'Top Rated': result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
  }
  return result;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, SidebarComponent, FilterBarComponent, BookSectionComponent, BrandBrowserComponent, RecommendedFromHistoryComponent],
  template: `
    <div class="flex h-[calc(100vh-3.5rem)] bg-base theme-transition">
      <app-sidebar
        [selectedCategory]="selectedCategory"
        [isOpen]="sidebarOpen"
        (categorySelected)="onSelectCategory($event)"
        (close)="sidebarOpen = false"
      />

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div class="flex items-stretch">
          <button class="lg:hidden px-3 transition-colors shrink-0"
                  style="color: var(--bw-text-secondary); background: var(--bw-bg-surface); border-bottom: 1px solid var(--bw-border)"
                  (click)="sidebarOpen = true">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div class="flex-1">
            <app-filter-bar [filters]="filters" (filtersChange)="filters = $event" />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto py-5">
          <!-- Greeting -->
          @if (authSvc.isAuthenticated() && authSvc.user() && !hasSearch && !isFiltered) {
            <div class="px-4 mb-5">
              <div class="p-4" style="background: var(--bw-accent-subtle); border: 1px solid var(--bw-accent-border)">
                <div class="flex items-center gap-2 mb-1">
                  <svg class="w-4 h-4" style="color: var(--bw-warning)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span class="text-xs font-semibold uppercase tracking-wide" style="color: var(--bw-warning)">Welcome back</span>
                </div>
                <p class="font-bold text-base" style="color: var(--bw-text-primary)">Hello, {{ authSvc.user()?.firstName }}! 👋</p>
                <p class="text-sm mt-0.5" style="color: var(--bw-text-secondary)">
                  You have <span class="font-semibold" style="color: var(--bw-success)">{{ authSvc.user()?.giftPoints }} gift points</span> to redeem.
                </p>
              </div>
            </div>
          }

          <!-- Category-filtered view -->
          @if (isFiltered) {
            @if (categoryBooks().length > 0) {
              <app-book-section [title]="categoryName" [books]="categoryBooks()" (bookClick)="navigate($event)" />
            } @else {
              <div class="flex flex-col items-center justify-center h-64" style="color: var(--bw-text-muted)">
                <p class="text-lg">No books found in this category</p>
                <button class="mt-3 text-sm bw-btn-outline px-4 py-1.5" (click)="selectedCategory = 'all'">Show all books</button>
              </div>
            }
          }

          <!-- All view -->
          @if (!isFiltered) {
            @if (!hasSearch) {
              <app-brand-browser [selectedPublisherId]="selectedPublisher" (publisherSelect)="selectedPublisher = $event" />
            }

            @if (allFiltered().length > 0) {
              <app-book-section title="Our Collection" [books]="allFiltered()" (bookClick)="navigate($event)" />
            } @else {
              <div class="flex flex-col items-center justify-center h-64" style="color: var(--bw-text-muted)">
                <p class="text-lg">No books found</p>
                <p class="text-sm mt-1">Try a different search term or clear filters</p>
              </div>
            }

            @if (!hasSearch) {
              @if (recommended().length > 0) {
                <app-book-section title="Recommended for You" [books]="recommended()" (bookClick)="navigate($event)" />
              }
              @if (bestsellers().length > 0) {
                <app-book-section title="Bestsellers this Month" [books]="bestsellers()" (bookClick)="navigate($event)" />
              }
              @if (newLaunches().length > 0) {
                <app-book-section title="New Launches" [books]="newLaunches()" (bookClick)="navigate($event)" />
              }
            }

            @if (authSvc.isAuthenticated() && !hasSearch) {
              <div class="px-4 mt-2 mb-6" style="border-top: 1px solid var(--bw-border)">
                <div class="flex items-center gap-2 mt-5 mb-3">
                  <svg class="w-4 h-4" style="color: var(--bw-accent)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <h2 class="font-bold text-base" style="color: var(--bw-text-primary)">Recommended Based on Your Orders</h2>
                </div>
                <app-recommended-from-history layout="row" />
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class HomePageComponent {
  authSvc = inject(AuthService);
  router = inject(Router);

  selectedCategory = 'all';
  selectedPublisher: string | undefined;
  sidebarOpen = false;
  filters: FilterState = { ...DEFAULT_FILTERS };

  get isFiltered(): boolean { return this.selectedCategory !== 'all'; }
  get hasSearch(): boolean { return this.filters.searchQuery.trim().length > 0; }
  get categoryName(): string {
    return this.selectedCategory.charAt(0).toUpperCase() + this.selectedCategory.slice(1).replace(/-/g, ' ');
  }

  private filterBooks(books: Book[]): Book[] {
    let result = this.selectedPublisher ? books.filter((b) => b.publisherId === this.selectedPublisher) : books;
    return applyFilters(result, this.filters);
  }

  categoryBooks = computed(() => this.isFiltered ? this.filterBooks(allBooks.filter((b) => b.categoryId === this.selectedCategory)) : []);
  allFiltered = computed(() => this.filterBooks(allBooks));
  recommended = computed(() => this.filterBooks(recommendedBooks));
  bestsellers = computed(() => this.filterBooks(bestsellerBooks));
  newLaunches = computed(() => this.filterBooks(newLaunchBooks));

  onSelectCategory(id: string): void {
    this.selectedCategory = id;
    this.selectedPublisher = undefined;
  }

  navigate(book: Book): void {
    this.router.navigate(['/book', book.id]);
  }
}
