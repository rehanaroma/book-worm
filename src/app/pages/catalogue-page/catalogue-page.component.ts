import { Component, Input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { allBooks, publishers, categories } from '../../data/books';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BrandBrowserComponent } from '../../components/brand-browser/brand-browser.component';

type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'rating';
type FormatFilter = 'All' | 'Paperback' | 'Hard Cover' | 'eBook';

@Component({
  selector: 'app-catalogue-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BookCardComponent, BrandBrowserComponent],
  template: `
    <div class="flex-1 overflow-y-auto bg-base theme-transition">
      <!-- Header -->
      <div class="px-4 pt-5 pb-3" style="border-bottom: 1px solid var(--bw-border)">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 class="text-xl font-bold" style="color: var(--bw-text-primary)">{{ categoryName }}</h1>
            <p class="text-sm mt-0.5" style="color: var(--bw-text-secondary)">{{ filtered.length }} books found</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative">
              <select [(ngModel)]="sort" (ngModelChange)="updateFilter()" class="appearance-none bw-input pr-7 w-auto text-sm">
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <svg class="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style="color: var(--bw-text-muted)"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <button (click)="filtersOpen = !filtersOpen" class="flex items-center gap-1.5 px-3 py-2 text-sm transition-colors bw-btn-outline">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="21" y1="4" x2="14" y2="4"/><line x1="10" y1="4" x2="3" y2="4"/>
                <line x1="21" y1="12" x2="12" y2="12"/><line x1="8" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="20" x2="16" y2="20"/><line x1="12" y1="20" x2="3" y2="20"/>
                <line x1="14" y1="2" x2="14" y2="6"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="16" y1="18" x2="16" y2="22"/>
              </svg>
              Filters
              @if (activeFilterCount > 0) {
                <span class="text-[10px] w-4 h-4 flex items-center justify-center font-bold text-white" style="background: var(--bw-accent)">{{ activeFilterCount }}</span>
              }
            </button>
          </div>
        </div>

        @if (filtersOpen) {
          <div class="mt-3 p-3 flex flex-wrap gap-4 items-start" style="background: var(--bw-bg-subtle); border: 1px solid var(--bw-border)">
            <div>
              <p class="text-xs mb-2 font-semibold" style="color: var(--bw-text-secondary)">Format</p>
              <div class="flex gap-2 flex-wrap">
                @for (f of ['All', 'Paperback', 'Hard Cover', 'eBook']; track f) {
                  <button (click)="format = $any(f); updateFilter()" class="px-3 py-1 text-xs transition-colors"
                          [style.background]="format === f ? 'var(--bw-accent)' : 'var(--bw-bg-surface)'"
                          [style.color]="format === f ? '#fff' : 'var(--bw-text-secondary)'"
                          [style.border]="'1px solid ' + (format === f ? 'var(--bw-accent)' : 'var(--bw-border)')">{{ f }}</button>
                }
              </div>
            </div>
            <div>
              <p class="text-xs mb-2 font-semibold" style="color: var(--bw-text-secondary)">Publisher</p>
              <div class="flex gap-2 flex-wrap">
                @for (p of publishers; track p.id) {
                  <button (click)="togglePublisher(p.id)" class="px-3 py-1 text-xs transition-colors"
                          [style.background]="selectedPublisher === p.id ? 'var(--bw-accent)' : 'var(--bw-bg-surface)'"
                          [style.color]="selectedPublisher === p.id ? '#fff' : 'var(--bw-text-secondary)'"
                          [style.border]="'1px solid ' + (selectedPublisher === p.id ? 'var(--bw-accent)' : 'var(--bw-border)')">{{ p.name }}</button>
                }
              </div>
            </div>
            @if (activeFilterCount > 0) {
              <button (click)="clearFilters()" class="flex items-center gap-1 text-xs" style="color: var(--bw-danger)">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Clear filters
              </button>
            }
          </div>
        }
      </div>

      <div class="pt-4">
        <app-brand-browser [selectedPublisherId]="selectedPublisher" (publisherSelect)="selectedPublisher = $event; updateFilter()" />
      </div>

      <div class="px-4 pb-8">
        @if (filtered.length === 0) {
          <div class="flex flex-col items-center justify-center h-64" style="color: var(--bw-text-muted)">
            <p class="text-lg">No books match your filters</p>
            <button (click)="clearFilters()" class="mt-3 text-sm hover:underline" style="color: var(--bw-accent)">Clear filters</button>
          </div>
        } @else {
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">
            @for (book of filtered; track book.id) {
              <app-book-card [book]="book" (bookClick)="router.navigate(['/book', $event.id])" />
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class CataloguePageComponent {
  @Input() set categoryId(val: string) {
    this._categoryId = val;
    this.updateFilter();
  }

  router = inject(Router);
  publishers = publishers;

  private _categoryId = 'all';
  selectedPublisher: string | undefined;
  format: FormatFilter = 'All';
  sort: SortKey = 'relevance';
  filtersOpen = false;
  filtered: any[] = [];

  get categoryName(): string {
    return categories.find((c) => c.id === this._categoryId)?.name ?? 'All Books';
  }

  get activeFilterCount(): number {
    return (this.selectedPublisher ? 1 : 0) + (this.format !== 'All' ? 1 : 0);
  }

  updateFilter(): void {
    let books = this._categoryId === 'all' ? allBooks : allBooks.filter((b) => b.categoryId === this._categoryId);
    if (this.selectedPublisher) books = books.filter((b) => b.publisherId === this.selectedPublisher);
    if (this.format !== 'All') books = books.filter((b) => b.format === this.format);
    switch (this.sort) {
      case 'price-asc': books = [...books].sort((a, b) => a.price - b.price); break;
      case 'price-desc': books = [...books].sort((a, b) => b.price - a.price); break;
      case 'rating': books = [...books].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
    }
    this.filtered = books;
  }

  togglePublisher(id: string): void {
    this.selectedPublisher = this.selectedPublisher === id ? undefined : id;
    this.updateFilter();
  }

  clearFilters(): void {
    this.selectedPublisher = undefined;
    this.format = 'All';
    this.updateFilter();
  }
}
