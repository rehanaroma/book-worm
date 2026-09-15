import { Injectable, signal, computed, effect } from '@angular/core';
import type { AuthCredentials, AuthState, AuthToken, RegisterPayload, User } from '../types';
import { AuthBackendService } from './auth-backend.service';

const GUEST_KEY = 'bw_guest';

export interface InternalAuthState extends AuthState {
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _state = signal<InternalAuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isGuest: false,
    loading: true,
  });

  readonly state = this._state.asReadonly();
  readonly user = computed(() => this._state().user);
  readonly token = computed(() => this._state().token);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isGuest = computed(() => this._state().isGuest);
  readonly loading = computed(() => this._state().loading);

  constructor(private backend: AuthBackendService) {
    this.backend.restoreSession().then((result) => {
      if (result) {
        this._state.set({
          user: result.user,
          token: { accessToken: result.token.accessToken, expiresIn: 3600 },
          isAuthenticated: true,
          isGuest: false,
          loading: false,
        });
      } else if (sessionStorage.getItem(GUEST_KEY) === 'true') {
        this._state.set({ user: null, token: null, isAuthenticated: false, isGuest: true, loading: false });
      } else {
        this._state.update((s) => ({ ...s, loading: false }));
      }
    });
  }

  async login(credentials: AuthCredentials): Promise<void> {
    const result = await this.backend.login(credentials);
    this._state.set({
      user: result.user,
      token: { accessToken: result.token.accessToken, expiresIn: 3600 },
      isAuthenticated: true,
      isGuest: false,
      loading: false,
    });
  }

  async register(payload: RegisterPayload): Promise<void> {
    const result = await this.backend.register(payload);
    this._state.set({
      user: result.user,
      token: { accessToken: result.token.accessToken, expiresIn: 3600 },
      isAuthenticated: true,
      isGuest: false,
      loading: false,
    });
  }

  async logout(): Promise<void> {
    await this.backend.logout();
    sessionStorage.removeItem(GUEST_KEY);
    this._state.set({ user: null, token: null, isAuthenticated: false, isGuest: false, loading: false });
  }

  continueAsGuest(): void {
    sessionStorage.setItem(GUEST_KEY, 'true');
    this._state.set({ user: null, token: null, isAuthenticated: false, isGuest: true, loading: false });
  }
}
