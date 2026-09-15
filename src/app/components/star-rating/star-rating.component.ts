import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1">
      <div class="flex">
        @for (i of stars; track i) {
          <svg
            [class]="'w-3 h-3 ' + (i <= roundedRating ? 'text-yellow-400 fill-yellow-400' : 'text-muted fill-current')"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        }
      </div>
      <span [class]="'text-yellow-400 font-medium ' + textSize">{{ rating.toFixed(1) }}</span>
      @if (count !== undefined) {
        <span [class]="'text-muted ' + textSize">({{ count.toLocaleString() }})</span>
      }
    </div>
  `,
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Input() count?: number;
  @Input() size: 'sm' | 'md' = 'sm';

  get stars() { return [1, 2, 3, 4, 5]; }
  get roundedRating() { return Math.round(this.rating); }
  get textSize() { return this.size === 'sm' ? 'text-[11px]' : 'text-xs'; }
}
