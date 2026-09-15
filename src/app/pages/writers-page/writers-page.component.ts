import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { allBooks } from '../../data/books';

const INITIALS_COLORS = [
  '#e05c3a', '#1a5fa8', '#2d6a4f', '#6a2d8a', '#7d4e1e',
  '#0077b6', '#c77dff', '#4cc9f0', '#d62828', '#219ebc',
];

function getColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return INITIALS_COLORS[Math.abs(h) % INITIALS_COLORS.length];
}

function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

interface Author {
  name: string;
  books: typeof allBooks;
  genres: Set<string>;
  color: string;
  avgRating: number;
  lowestPrice: number;
}

function buildAuthors(): Author[] {
  const map: Record<string, { name: string; books: typeof allBooks; genres: Set<string> }> = {};
  for (const book of allBooks) {
    if (!map[book.author]) map[book.author] = { name: book.author, books: [], genres: new Set() };
    map[book.author].books.push(book);
    book.genres.forEach((g) => map[book.author].genres.add(g));
  }
  return Object.values(map).sort((a, b) => b.books.length - a.books.length).map((a) => ({
    ...a,
    color: getColor(a.name),
    avgRating: a.books.reduce((s, b) => s + (b.rating ?? 0), 0) / a.books.length,
    lowestPrice: Math.min(...a.books.map((b) => b.price)),
  }));
}

const AUTHORS = buildAuthors();

@Component({
  selector: 'app-writers-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex-1 overflow-y-auto bg-base theme-transition px-4 py-6">
      <div class="flex items-center gap-3 mb-1">
        <svg class="w-5 h-5" style="color: var(--bw-accent)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
        <h1 class="text-2xl font-bold" style="color: var(--bw-text-primary)">My Writers</h1>
      </div>
      <p class="text-sm mb-5" style="color: var(--bw-text-secondary)">{{ AUTHORS.length }} authors available in our catalogue</p>

      <div class="relative max-w-sm mb-6">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color: var(--bw-text-muted)"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Search authors…" [(ngModel)]="query" class="bw-input pl-8 text-sm" />
      </div>

      @if (filtered.length === 0) {
        <div class="flex flex-col items-center justify-center h-48" style="color: var(--bw-text-muted)">
          <p>No authors found for "{{ query }}"</p>
        </div>
      } @else {
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
          @for (author of filtered; track author.name) {
            <div class="bw-card flex flex-col overflow-hidden group cursor-pointer theme-transition"
                 (click)="router.navigate(['/catalogue/all'])"
                 (mouseenter)="$any($event.currentTarget).style.borderColor='var(--bw-accent)'"
                 (mouseleave)="$any($event.currentTarget).style.borderColor='var(--bw-border)'">
              <div class="h-16 flex items-center justify-center gap-4"
                   [style.backgroundColor]="author.color + '22'"
                   style="border-bottom: 1px solid var(--bw-border)">
                <div class="w-12 h-12 flex items-center justify-center text-white font-bold text-base shadow"
                     [style.backgroundColor]="author.color">
                  {{ getInitials(author.name) }}
                </div>
              </div>
              <div class="p-3 flex flex-col gap-1.5 flex-1">
                <h3 class="text-sm font-bold leading-tight" style="color: var(--bw-text-primary)">{{ author.name }}</h3>
                <div class="flex flex-wrap gap-1">
                  @for (g of getGenres(author); track g) {
                    <span class="text-[10px] px-1.5 py-0.5" style="background: var(--bw-bg-subtle); color: var(--bw-text-secondary)">{{ g }}</span>
                  }
                </div>
                <div class="flex items-center justify-between mt-auto pt-2" style="border-top: 1px solid var(--bw-border-subtle)">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5" style="color: var(--bw-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                    <span class="text-xs" style="color: var(--bw-text-secondary)">{{ author.books.length }} {{ author.books.length === 1 ? 'book' : 'books' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    @if (author.avgRating > 0) {
                      <span class="text-[11px] font-medium" style="color: var(--bw-warning)">★ {{ author.avgRating.toFixed(1) }}</span>
                    }
                    <span class="text-[11px]" style="color: var(--bw-text-muted)">from ₹{{ author.lowestPrice }}</span>
                  </div>
                </div>
                <button class="flex items-center gap-1 text-[11px] font-medium transition-colors mt-1" style="color: var(--bw-accent)"
                        (click)="$event.stopPropagation(); router.navigate(['/catalogue/all'])">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Browse books
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class WritersPageComponent {
  router = inject(Router);
  query = '';
  AUTHORS = AUTHORS;

  get filtered(): Author[] {
    return AUTHORS.filter((a) => a.name.toLowerCase().includes(this.query.toLowerCase()));
  }

  getInitials(name: string): string { return initials(name); }
  getGenres(author: Author): string[] { return [...author.genres].slice(0, 3); }
}
