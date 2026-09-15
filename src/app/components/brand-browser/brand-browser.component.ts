import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { publishers } from '../../data/books';

@Component({
  selector: 'app-brand-browser',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="px-4 mb-5">
      <h2 class="text-sm font-semibold mb-3"
          style="color: var(--bw-text-secondary); text-transform: uppercase; letter-spacing: 0.06em">
        Browse by Publisher
      </h2>
      <div class="flex gap-3 overflow-x-auto pb-2">
        @for (pub of publishers; track pub.id) {
          <button
            (click)="handleClick(pub.id)"
            class="shrink-0 flex flex-col items-center justify-center w-24 h-20 border transition-all"
            [style.background]="selectedPublisherId === pub.id ? 'var(--bw-accent-subtle)' : 'var(--bw-bg-surface)'"
            [style.borderColor]="selectedPublisherId === pub.id ? 'var(--bw-accent)' : 'var(--bw-border)'"
            [style.transform]="selectedPublisherId === pub.id ? 'scale(1.05)' : 'scale(1)'"
            (mouseenter)="onEnter($event, pub.id)"
            (mouseleave)="onLeave($event, pub.id)"
          >
            <div class="w-10 h-10 flex items-center justify-center text-white font-bold text-xs mb-1.5 shadow-sm"
                 [style.backgroundColor]="pub.logoColor">
              {{ pub.logoText }}
            </div>
            <span class="text-[10px] text-center leading-tight line-clamp-2 px-1"
                  style="color: var(--bw-text-secondary)">{{ pub.name }}</span>
          </button>
        }
      </div>
    </div>
  `,
})
export class BrandBrowserComponent {
  @Input() selectedPublisherId?: string;
  @Output() publisherSelect = new EventEmitter<string | undefined>();

  publishers = publishers;

  handleClick(id: string): void {
    this.publisherSelect.emit(this.selectedPublisherId === id ? undefined : id);
  }

  onEnter(e: MouseEvent, id: string): void {
    if (this.selectedPublisherId !== id) {
      const btn = e.currentTarget as HTMLElement;
      btn.style.borderColor = 'var(--bw-accent)';
      btn.style.background = 'var(--bw-bg-hover)';
    }
  }
  onLeave(e: MouseEvent, id: string): void {
    if (this.selectedPublisherId !== id) {
      const btn = e.currentTarget as HTMLElement;
      btn.style.borderColor = 'var(--bw-border)';
      btn.style.background = 'var(--bw-bg-surface)';
    }
  }
}
