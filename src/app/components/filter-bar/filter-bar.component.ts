import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterState {
  searchQuery: string;
  language: string;
  format: string;
  priceRange: string;
  sortBy: string;
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  language: 'All',
  format: 'All',
  priceRange: 'All',
  sortBy: 'Relevance',
};

const LANGUAGE_OPTS = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];
const FORMAT_OPTS   = ['All', 'Paperback', 'Hard Cover', 'eBook'];
const PRICE_OPTS    = ['All', 'Under ₹100', '₹100–₹300', '₹300–₹500', 'Above ₹500'];
const SORT_OPTS     = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Newest', 'Top Rated'];

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-wrap items-center gap-2 px-4 py-2.5 theme-transition bg-surface"
         style="border-bottom: 1px solid var(--bw-border)">
      <!-- Search -->
      <div class="relative flex-1 min-w-[160px] max-w-sm">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style="color: var(--bw-text-muted)"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Search you want to read here" [(ngModel)]="filters.searchQuery"
               (ngModelChange)="emit()" class="bw-input pl-8 text-sm py-1.5" />
        @if (filters.searchQuery) {
          <button (click)="clearSearch()" class="absolute right-2.5 top-1/2 -translate-y-1/2" style="color: var(--bw-text-muted)">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        }
      </div>

      <!-- Language -->
      <div class="relative flex items-center">
        <label class="absolute left-2.5 -top-2 text-[10px] px-0.5 z-10 pointer-events-none"
               style="color: var(--bw-text-muted); background-color: var(--bw-bg-surface)">Language</label>
        <select [(ngModel)]="filters.language" (ngModelChange)="emit()"
                class="bw-input text-xs pr-6 pl-2 py-1.5 min-w-[100px] appearance-none cursor-pointer">
          @for (opt of languageOpts; track opt) { <option [value]="opt">{{ opt }}</option> }
        </select>
      </div>

      <!-- Format -->
      <div class="relative flex items-center">
        <label class="absolute left-2.5 -top-2 text-[10px] px-0.5 z-10 pointer-events-none"
               style="color: var(--bw-text-muted); background-color: var(--bw-bg-surface)">Format</label>
        <select [(ngModel)]="filters.format" (ngModelChange)="emit()"
                class="bw-input text-xs pr-6 pl-2 py-1.5 min-w-[100px] appearance-none cursor-pointer">
          @for (opt of formatOpts; track opt) { <option [value]="opt">{{ opt }}</option> }
        </select>
      </div>

      <!-- Price Range -->
      <div class="relative flex items-center">
        <label class="absolute left-2.5 -top-2 text-[10px] px-0.5 z-10 pointer-events-none"
               style="color: var(--bw-text-muted); background-color: var(--bw-bg-surface)">Price Range</label>
        <select [(ngModel)]="filters.priceRange" (ngModelChange)="emit()"
                class="bw-input text-xs pr-6 pl-2 py-1.5 min-w-[100px] appearance-none cursor-pointer">
          @for (opt of priceOpts; track opt) { <option [value]="opt">{{ opt }}</option> }
        </select>
      </div>

      <!-- Sort by -->
      <div class="relative flex items-center">
        <label class="absolute left-2.5 -top-2 text-[10px] px-0.5 z-10 pointer-events-none"
               style="color: var(--bw-text-muted); background-color: var(--bw-bg-surface)">Sort by</label>
        <select [(ngModel)]="filters.sortBy" (ngModelChange)="emit()"
                class="bw-input text-xs pr-6 pl-2 py-1.5 min-w-[100px] appearance-none cursor-pointer">
          @for (opt of sortOpts; track opt) { <option [value]="opt">{{ opt }}</option> }
        </select>
      </div>

      @if (hasFilters) {
        <button (click)="clearFilters()" class="flex items-center gap-1 text-xs transition-colors" style="color: var(--bw-danger)">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          <span class="hidden sm:inline">Clear</span>
        </button>
      }
    </div>
  `,
})
export class FilterBarComponent {
  @Input() filters: FilterState = { ...DEFAULT_FILTERS };
  @Output() filtersChange = new EventEmitter<FilterState>();

  languageOpts = LANGUAGE_OPTS;
  formatOpts = FORMAT_OPTS;
  priceOpts = PRICE_OPTS;
  sortOpts = SORT_OPTS;

  get hasFilters(): boolean {
    return this.filters.language !== 'All' || this.filters.format !== 'All' ||
      this.filters.priceRange !== 'All' || this.filters.sortBy !== 'Relevance';
  }

  emit(): void { this.filtersChange.emit({ ...this.filters }); }

  clearSearch(): void {
    this.filters = { ...this.filters, searchQuery: '' };
    this.emit();
  }

  clearFilters(): void {
    this.filters = { ...DEFAULT_FILTERS, searchQuery: this.filters.searchQuery };
    this.emit();
  }
}
