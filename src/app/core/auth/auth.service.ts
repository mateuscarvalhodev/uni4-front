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

  hasRole(role: Role) {
    return this._user()?.role === role;
  }

  hasAnyRole(...roles: Role[]) {
    const r = this._user()?.role;
    return !!r && roles.includes(r);
  }

  async login(email: string, _password: string, role: Role = 'ADMIN') {
    const name = (email || '').split('@')[0] || 'Usuário';
    const user: AuthUser = { id: 1, name, email, role };
    this._user.set(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
    return true;
  }

  logout() {
    this._user.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}
