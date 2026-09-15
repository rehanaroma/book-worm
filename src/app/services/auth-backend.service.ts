import { Injectable } from '@angular/core';
import type { AuthCredentials, AuthToken, RegisterPayload, User } from '../types';

const STORAGE_KEYS = {
  USERS: 'bw_users',
  TOKEN: 'bw_token',
  CURRENT_USER: 'bw_current_user',
} as const;

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) ?? '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function generateId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function issueToken(userId: string): AuthToken {
  return { accessToken: btoa(`${userId}:${Date.now()}`), expiresIn: 3600 };
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (Math.imul(31, hash) + password.charCodeAt(i)) | 0;
  }
  return hash.toString(16);
}

export interface LoginResult {
  user: User;
  token: AuthToken;
}

@Injectable({ providedIn: 'root' })
export class AuthBackendService {
  async login(credentials: AuthCredentials): Promise<LoginResult> {
    await new Promise((r) => setTimeout(r, 600));
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
    if (!user) throw new Error('No account found with that email address.');
    if (hashPassword(credentials.password) !== (user as User & { _pwHash: string })['_pwHash' as keyof User]) {
      throw new Error('Incorrect password. Please try again.');
    }
    const token = issueToken(user.id);
    this.persistSession(user, token);
    return { user, token };
  }

  async register(payload: RegisterPayload): Promise<LoginResult> {
    await new Promise((r) => setTimeout(r, 700));
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('An account with this email already exists. Please log in.');
    }
    if (payload.password.length < 6) throw new Error('Password must be at least 6 characters.');

    const newUser: User & { _pwHash: string } = {
      id: generateId(),
      email: payload.email.toLowerCase(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: 'member',
      avatarInitials: `${payload.firstName[0]}${payload.lastName[0]}`.toUpperCase(),
      createdAt: new Date().toISOString(),
      giftPoints: 100,
      _pwHash: hashPassword(payload.password),
    };
    saveUsers([...users, newUser]);
    const { _pwHash: _discarded, ...user } = newUser;
    const token = issueToken(user.id);
    this.persistSession(user, token);
    return { user, token };
  }

  async logout(): Promise<void> {
    this.clearSession();
  }

  async restoreSession(): Promise<LoginResult | null> {
    try {
      const rawToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const rawUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!rawToken || !rawUser) return null;
      const token: AuthToken = JSON.parse(rawToken);
      const user: User = JSON.parse(rawUser);
      const users = getUsers();
      const found = users.find((u) => u.id === user.id);
      if (!found) { this.clearSession(); return null; }
      return { user, token };
    } catch {
      this.clearSession();
      return null;
    }
  }

  persistSession(user: User, token: AuthToken): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(token));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  getStoredToken(): AuthToken | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TOKEN);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
