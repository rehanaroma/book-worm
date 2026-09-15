import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { categories, allBooks } from '../../data/books';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Mobile overlay -->
    @if (isOpen) {
      <div class="fixed inset-0 bg-black/50 z-30 lg:hidden" (click)="close.emit()"></div>
    }

    <aside
      class="w-48 shrink-0 overflow-y-auto bg-sidebar theme-transition fixed top-14 left-0 h-[calc(100vh-3.5rem)] z-40 transition-transform duration-300 lg:block lg:sticky lg:top-0 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0"
      [class.-translate-x-full]="!isOpen"
      [class.translate-x-0]="isOpen"
      style="border-right: 1px solid var(--bw-border)">
      <ul class="py-2">
        @for (cat of categories; track cat.id) {
          <li>
            <button
              (click)="selectCat(cat.id)"
              class="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between gap-2"
              [style.color]="selectedCategory === cat.id ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)'"
              [style.background]="selectedCategory === cat.id ? 'var(--bw-bg-active)' : 'transparent'"
              [style.fontWeight]="selectedCategory === cat.id ? '600' : '400'"
              [style.borderLeft]="selectedCategory === cat.id ? '2px solid var(--bw-accent)' : '2px solid transparent'"
              (mouseenter)="onMouseEnter($event, cat.id)"
              (mouseleave)="onMouseLeave($event, cat.id)"
            >
              <span class="truncate">{{ cat.name }}</span>
              @if (getCategoryCount(cat.id) > 0 && cat.id !== 'all') {
                <span class="text-[10px] min-w-[18px] h-4 flex items-center justify-center font-medium shrink-0 px-1"
                      [style.background]="selectedCategory === cat.id ? 'var(--bw-accent)' : 'var(--bw-bg-subtle)'"
                      [style.color]="selectedCategory === cat.id ? '#fff' : 'var(--bw-text-muted)'">
                  {{ getCategoryCount(cat.id) }}
                </span>
              }
            </button>
          </li>
        }
      </ul>
    </aside>
  `,
})
export class SidebarComponent {
  @Input() selectedCategory = 'all';
  @Input() isOpen = true;
  @Output() categorySelected = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  categories = categories;

  private counts: Record<string, number> = (() => {
    const map: Record<string, number> = { all: allBooks.length };
    for (const book of allBooks) {
      map[book.categoryId] = (map[book.categoryId] ?? 0) + 1;
    }
    return map;
  })();

  getCategoryCount(id: string): number {
    return this.counts[id] ?? 0;
  }

  selectCat(id: string): void {
    this.categorySelected.emit(id);
    this.close.emit();
  }

  onMouseEnter(e: MouseEvent, id: string): void {
    if (this.selectedCategory !== id) {
      (e.currentTarget as HTMLElement).style.background = 'var(--bw-bg-hover)';
    }
  }
  onMouseLeave(e: MouseEvent, id: string): void {
    if (this.selectedCategory !== id) {
      (e.currentTarget as HTMLElement).style.background = 'transparent';
    }
  }
}
