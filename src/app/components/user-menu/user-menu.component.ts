import { Component, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Not authenticated -->
    @if (!authSvc.isAuthenticated() && !authSvc.isGuest()) {
      <button (click)="router.navigate(['/login'])" class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold transition-colors bw-btn-primary">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Sign In
      </button>
    }

    <!-- Guest -->
    @if (authSvc.isGuest()) {
      <button (click)="router.navigate(['/login'])" class="flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors bw-btn-outline">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span class="hidden sm:inline">Guest</span>
      </button>
    }

    <!-- Authenticated member -->
    @if (authSvc.isAuthenticated()) {
      <div class="relative">
        <button
          (click)="open = !open"
          class="flex items-center gap-2 px-2 py-1 transition-colors"
          style="color: var(--bw-text-primary);"
          (mouseenter)="$any($event.currentTarget).style.background='var(--bw-bg-hover)'"
          (mouseleave)="$any($event.currentTarget).style.background='transparent'"
        >
          <div class="w-8 h-8 flex items-center justify-center text-white text-xs font-bold shrink-0"
               style="background: linear-gradient(135deg, var(--bw-accent), #7c3aed)">
            {{ authSvc.user()?.avatarInitials }}
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-semibold leading-tight" style="color: var(--bw-text-primary)">
              {{ authSvc.user()?.firstName }} {{ authSvc.user()?.lastName }}
            </p>
            <p class="text-[10px] leading-tight" style="color: var(--bw-text-muted)">{{ authSvc.user()?.email }}</p>
          </div>
          <svg class="w-3.5 h-3.5 transition-transform" [class.rotate-180]="open" style="color:var(--bw-text-muted)"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        @if (open) {
          <div class="absolute right-0 top-full mt-2 w-56 z-50 overflow-hidden"
               style="background: var(--bw-bg-elevated); border: 1px solid var(--bw-border); box-shadow: var(--bw-shadow-lg)">
            <div class="px-4 py-3" style="border-bottom: 1px solid var(--bw-border)">
              <p class="text-sm font-semibold" style="color: var(--bw-text-primary)">{{ authSvc.user()?.firstName }} {{ authSvc.user()?.lastName }}</p>
              <p class="text-xs mt-0.5 truncate" style="color: var(--bw-text-secondary)">{{ authSvc.user()?.email }}</p>
              <div class="flex items-center gap-1.5 mt-2 px-2 py-1"
                   style="background: var(--bw-success-subtle); border: 1px solid var(--bw-success-border)">
                <svg class="w-3.5 h-3.5 shrink-0" style="color: var(--bw-success)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/>
                  <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
                </svg>
                <span class="text-xs font-medium" style="color: var(--bw-success)">{{ authSvc.user()?.giftPoints ?? 0 }} Gift Points</span>
              </div>
            </div>
            <div class="py-1">
              <button (click)="goto('/orders')" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style="color: var(--bw-text-secondary)"
                      (mouseenter)="hoverMenuItem($event, true)" (mouseleave)="hoverMenuItem($event, false)">
                <svg class="w-4 h-4" style="color: var(--bw-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
                My Orders
              </button>
              <button (click)="goto('/wishlist')" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style="color: var(--bw-text-secondary)"
                      (mouseenter)="hoverMenuItem($event, true)" (mouseleave)="hoverMenuItem($event, false)">
                <svg class="w-4 h-4" style="color: var(--bw-text-muted)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                My Profile
              </button>
            </div>
            <div style="border-top: 1px solid var(--bw-border)" class="py-1">
              <button (click)="handleLogout()" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors"
                      style="color: var(--bw-danger)"
                      (mouseenter)="$any($event.currentTarget).style.background='var(--bw-danger-subtle)'"
                      (mouseleave)="$any($event.currentTarget).style.background='transparent'">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class UserMenuComponent {
  authSvc = inject(AuthService);
  router = inject(Router);
  open = false;

  constructor(private el: ElementRef) {}

  @HostListener('document:mousedown', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target)) this.open = false;
  }

  goto(path: string): void {
    this.open = false;
    this.router.navigate([path]);
  }

  async handleLogout(): Promise<void> {
    this.open = false;
    await this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  hoverMenuItem(e: MouseEvent, entering: boolean): void {
    const btn = e.currentTarget as HTMLButtonElement;
    btn.style.background = entering ? 'var(--bw-bg-hover)' : 'transparent';
    btn.style.color = entering ? 'var(--bw-text-primary)' : 'var(--bw-text-secondary)';
  }
}
