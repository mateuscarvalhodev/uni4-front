import { Injectable, signal } from '@angular/core';

export type Role = 'ADMIN' | 'COORDENADOR' | 'PROFESSOR' | 'ALUNO';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'uni4.auth.user';
  private _user = signal<AuthUser | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        try {
          this._user.set(JSON.parse(raw));
        } catch {}
      }
    }
  }

  user() {
    return this._user();
  }
  isAuthenticated() {
    return this._user() !== null;
  }
  hasAnyRole(...roles: Role[]) {
    const r = this._user()?.role;
    return !!r && roles.includes(r);
  }

  async login(email: string, password: string): Promise<boolean> {
    const e = (email ?? '').trim().toLowerCase();
    const p = (password ?? '').trim();

    if (e === 'dev@uni4.com' && p === '123456') {
      const u: AuthUser = { id: 1, name: 'Dev Admin', email: 'dev@uni4.com', role: 'ADMIN' };
      this._user.set(u);
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(u));
      }
      return true;
    }

    return false;
  }

  logout() {
    this._user.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}
