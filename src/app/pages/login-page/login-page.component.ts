import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

type Tab = 'login' | 'register';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-base flex items-center justify-center px-4 py-10">
      <!-- Background blobs -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-accent-subtle blur-3xl"></div>
        <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-accent-subtle blur-3xl"></div>
      </div>

      <div class="w-full max-w-md relative">
        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
          <a routerLink="/" class="flex items-center gap-2.5 mb-2">
            <div class="w-10 h-10 flex items-center justify-center shadow-lg" style="background-color: var(--bw-action)">
              <svg class="w-5 h-5" style="color: var(--bw-text-inverse)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <span class="text-primary text-2xl font-bold tracking-tight">Book Worm</span>
          </a>
          <p class="text-secondary text-sm">Your personal reading companion</p>
        </div>

        <!-- Checkout notice -->
        @if (isCheckout) {
          <div class="flex items-start gap-3 px-4 py-3 mb-4"
               style="background: var(--bw-warning-subtle); border: 1px solid var(--bw-warning)">
            <svg class="w-4 h-4 mt-0.5 shrink-0" style="color: var(--bw-warning)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <p class="text-xs leading-relaxed" style="color: var(--bw-text-secondary)">
              Your cart is saved. Sign in or create a free account to complete your purchase.
            </p>
          </div>
        }

        <!-- Card -->
        <div class="bw-card overflow-hidden shadow-2xl">
          <!-- Tabs -->
          <div class="flex border-b border-base">
            <button (click)="tab='login'" class="flex-1 py-3.5 text-sm font-semibold transition-colors"
                    [class.text-primary]="tab==='login'" [class.text-secondary]="tab!=='login'"
                    [class.border-b-2]="tab==='login'" [class.border-accent]="tab==='login'"
                    [class.bg-accent-subtle]="tab==='login'">
              Sign In
            </button>
            <button (click)="tab='register'" class="flex-1 py-3.5 text-sm font-semibold transition-colors"
                    [class.text-primary]="tab==='register'" [class.text-secondary]="tab!=='register'"
                    [class.border-b-2]="tab==='register'" [class.border-accent]="tab==='register'"
                    [class.bg-accent-subtle]="tab==='register'">
              Create Account
            </button>
          </div>

          <!-- Form body -->
          <div class="p-6">
            @if (tab === 'login') {
              <!-- Login form -->
              <form (ngSubmit)="handleLogin()" class="space-y-4" novalidate>
                @if (serverError) {
                  <div class="bg-danger-subtle border border-danger text-danger text-sm px-3 py-2.5">{{ serverError }}</div>
                }
                <div>
                  <label class="block text-secondary text-sm mb-1.5 font-medium">Email Address</label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input type="email" placeholder="you@example.com" [(ngModel)]="loginEmail" name="loginEmail"
                           class="bw-input pl-9" [class.border-danger]="loginErrors['email']" />
                  </div>
                  @if (loginErrors['email']) { <p class="text-danger text-xs mt-1">{{ loginErrors['email'] }}</p> }
                </div>
                <div>
                  <label class="block text-secondary text-sm mb-1.5 font-medium">Password</label>
                  <div class="relative">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input [type]="showLoginPw ? 'text' : 'password'" placeholder="••••••••" [(ngModel)]="loginPassword" name="loginPassword"
                           class="bw-input pl-9 pr-10" [class.border-danger]="loginErrors['password']" />
                    <button type="button" (click)="showLoginPw = !showLoginPw"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                      @if (showLoginPw) {
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      } @else {
                        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      }
                    </button>
                  </div>
                  @if (loginErrors['password']) { <p class="text-danger text-xs mt-1">{{ loginErrors['password'] }}</p> }
                </div>
                <button type="submit" [disabled]="loginLoading" class="w-full bw-btn-primary justify-center py-2.5">
                  @if (loginLoading) {
                    <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Signing in…
                  } @else {
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                    Sign In
                  }
                </button>
              </form>
            }

            @if (tab === 'register') {
              <!-- Register form -->
              <form (ngSubmit)="handleRegister()" class="space-y-4" novalidate>
                @if (serverError) {
                  <div class="bg-danger-subtle border border-danger text-danger text-sm px-3 py-2.5">{{ serverError }}</div>
                }
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-secondary text-sm mb-1.5 font-medium">First Name</label>
                    <input type="text" placeholder="First" [(ngModel)]="regFirstName" name="regFirstName" class="bw-input" />
                    @if (regErrors['firstName']) { <p class="text-danger text-xs mt-1">{{ regErrors['firstName'] }}</p> }
                  </div>
                  <div>
                    <label class="block text-secondary text-sm mb-1.5 font-medium">Last Name</label>
                    <input type="text" placeholder="Last" [(ngModel)]="regLastName" name="regLastName" class="bw-input" />
                    @if (regErrors['lastName']) { <p class="text-danger text-xs mt-1">{{ regErrors['lastName'] }}</p> }
                  </div>
                </div>
                <div>
                  <label class="block text-secondary text-sm mb-1.5 font-medium">Email Address</label>
                  <input type="email" placeholder="you@example.com" [(ngModel)]="regEmail" name="regEmail" class="bw-input" />
                  @if (regErrors['email']) { <p class="text-danger text-xs mt-1">{{ regErrors['email'] }}</p> }
                </div>
                <div>
                  <label class="block text-secondary text-sm mb-1.5 font-medium">Password</label>
                  <input type="password" placeholder="Min 6 characters" [(ngModel)]="regPassword" name="regPassword" class="bw-input" />
                  @if (regErrors['password']) { <p class="text-danger text-xs mt-1">{{ regErrors['password'] }}</p> }
                </div>
                <div>
                  <label class="block text-secondary text-sm mb-1.5 font-medium">Confirm Password</label>
                  <input type="password" placeholder="Re-enter password" [(ngModel)]="regConfirmPw" name="regConfirmPw" class="bw-input" />
                  @if (regErrors['confirmPw']) { <p class="text-danger text-xs mt-1">{{ regErrors['confirmPw'] }}</p> }
                </div>
                <div class="flex items-center gap-2 bg-success-subtle border border-success px-3 py-2">
                  <svg class="w-4 h-4 text-success shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
                  </svg>
                  <p class="text-success text-xs">New members receive <strong>₹100 gift points</strong> on sign-up!</p>
                </div>
                <button type="submit" [disabled]="regLoading" class="w-full bw-btn-primary justify-center py-2.5">
                  @if (regLoading) { <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Creating account… }
                  @else { <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg> Create Account }
                </button>
              </form>
            }

            <!-- Guest option -->
            @if (!isCheckout) {
              <div class="flex items-center gap-3 my-5">
                <div class="flex-1 h-px bg-subtle"></div>
                <span class="text-muted text-xs">or</span>
                <div class="flex-1 h-px bg-subtle"></div>
              </div>
              <button (click)="handleGuest()" class="w-full bw-btn-outline justify-center py-2.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                Continue as Guest
              </button>
            }

            <p class="text-muted text-xs text-center mt-4 leading-relaxed">
              By continuing, you agree to Book Worm's
              <span class="text-secondary hover:underline cursor-pointer">Terms of Service</span> and
              <span class="text-secondary hover:underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginPageComponent {
  private authSvc = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tab: Tab = 'login';
  isCheckout = false;
  from = '/';

  // Login form
  loginEmail = '';
  loginPassword = '';
  loginErrors: Record<string, string> = {};
  loginLoading = false;
  showLoginPw = false;
  serverError = '';

  // Register form
  regFirstName = '';
  regLastName = '';
  regEmail = '';
  regPassword = '';
  regConfirmPw = '';
  regErrors: Record<string, string> = {};
  regLoading = false;

  constructor() {
    if (this.authSvc.isAuthenticated()) {
      this.router.navigate([this.from], { replaceUrl: true });
      return;
    }
    this.route.queryParams.subscribe((p) => {
      this.from = p['from'] ?? '/';
      this.isCheckout = p['reason'] === 'checkout';
      if (p['tab'] === 'register') this.tab = 'register';
    });
  }

  async handleLogin(): Promise<void> {
    this.loginErrors = {};
    if (!this.loginEmail.trim()) this.loginErrors['email'] = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginEmail)) this.loginErrors['email'] = 'Enter a valid email.';
    if (!this.loginPassword) this.loginErrors['password'] = 'Password is required.';
    if (Object.keys(this.loginErrors).length) return;
    this.serverError = '';
    this.loginLoading = true;
    try {
      await this.authSvc.login({ email: this.loginEmail, password: this.loginPassword });
      this.router.navigate([this.from], { replaceUrl: true });
    } catch (err) {
      this.serverError = err instanceof Error ? err.message : 'Login failed.';
    } finally { this.loginLoading = false; }
  }

  async handleRegister(): Promise<void> {
    this.regErrors = {};
    if (!this.regFirstName.trim()) this.regErrors['firstName'] = 'First name is required.';
    if (!this.regLastName.trim()) this.regErrors['lastName'] = 'Last name is required.';
    if (!this.regEmail.trim()) this.regErrors['email'] = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.regEmail)) this.regErrors['email'] = 'Enter a valid email.';
    if (!this.regPassword) this.regErrors['password'] = 'Password is required.';
    else if (this.regPassword.length < 6) this.regErrors['password'] = 'Must be at least 6 characters.';
    if (this.regConfirmPw !== this.regPassword) this.regErrors['confirmPw'] = 'Passwords do not match.';
    if (Object.keys(this.regErrors).length) return;
    this.serverError = '';
    this.regLoading = true;
    try {
      await this.authSvc.register({ firstName: this.regFirstName, lastName: this.regLastName, email: this.regEmail, password: this.regPassword });
      this.router.navigate([this.from], { replaceUrl: true });
    } catch (err) {
      this.serverError = err instanceof Error ? err.message : 'Registration failed.';
    } finally { this.regLoading = false; }
  }

  handleGuest(): void {
    this.authSvc.continueAsGuest();
    this.router.navigate([this.from], { replaceUrl: true });
  }
}
