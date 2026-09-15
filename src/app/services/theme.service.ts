import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'bw_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);

  private _theme = signal<Theme>(this._getInitialTheme());

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    effect(() => {
      const t = this._theme();
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(STORAGE_KEY, t);
    });
  }

  private _getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  toggleTheme(): void {
    this._theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }
}
