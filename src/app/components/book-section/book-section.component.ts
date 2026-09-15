import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Book } from '../../types';
import { BookCardComponent } from '../book-card/book-card.component';

@Component({
  selector: 'app-book-section',
  standalone: true,
  imports: [CommonModule, BookCardComponent],
  template: `
    <section class="mb-8">
      <h2 class="font-bold text-base mb-3 px-4" style="color: var(--bw-text-primary)">{{ title }}</h2>
      <div class="px-4" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px">
        @for (book of books; track book.id) {
          <app-book-card [book]="book" (bookClick)="bookClick.emit($event)" />
        }
      </div>
    </section>
  `,
})
export class BookSectionComponent {
  @Input() title = '';
  @Input() books: Book[] = [];
  @Output() bookClick = new EventEmitter<Book>();
}
