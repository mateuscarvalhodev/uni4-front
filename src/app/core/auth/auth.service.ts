import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  AuthUser,
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  Role,
} from './auth.types';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageTokenKey = 'uni4.auth.token';
  private storageUserKey = 'uni4.auth.user';

  private _user = signal<AuthUser | null>(null);

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.storageTokenKey);
      const rawUser = localStorage.getItem(this.storageUserKey);
      if (token && rawUser) {
        try {
          this._user.set(JSON.parse(rawUser) as AuthUser);
        } catch {
          this.clearStorage();
        }
      }
    }
  }

  user() {
    return this._user();
  }
  token(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.storageTokenKey);
  }
  isAuthenticated(): boolean {
    const t = this.token();
    if (!t) return false;
    return !this.isTokenExpired(t);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeJwt(token) as Record<string, any> | null;
      if (!payload) return true;
      const exp = Number(payload['exp']);
      if (!exp) return false;
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }

  private buildUserFromToken(token: string): AuthUser | null {
    try {
      const p = this.decodeJwt(token) as Record<string, any> | null;
      if (!p) return null;

      const id = Number(p['sub'] ?? p['id'] ?? 0);
      const name = String(p['name'] ?? p['username'] ?? '');
      const email = String(p['email'] ?? '');
      const role = (p['role'] ?? (Array.isArray(p['roles']) ? p['roles'][0] : 'user')) as Role;

      return { id, name: name || email.split('@')[0] || 'Usuário', email, role };
    } catch {
      return null;
    }
  }
  private decodeJwt(token: string): Record<string, any> | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, '=');
    const json =
      typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
    return JSON.parse(json);
  }

  hasAnyRole(...roles: Role[]) {
    const r = this._user()?.role;
    return !!r && roles.includes(r);
  }

  login$(username: string, password: string): Observable<boolean> {
    const body: LoginRequestDTO = {
      username: (username ?? '').trim(),
      password: (password ?? '').trim(),
    };

    return this.http.post<LoginResponseDTO>(`${environment.authBaseUrl}/login`, body).pipe(
      tap((res) => {
        const token = res.accessToken || res.token || res.jwt;
        if (!token) throw new Error('Token ausente na resposta');
        this.persistToken(token);

        const user = this.buildUserFromToken(token) ?? {
          id: 0,
          name: body.username,
          email: '',
          role: 'user' as Role,
        };
        this._user.set(user);
        this.persistUser(user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  register$(dto: RegisterRequestDTO): Observable<boolean> {
    return this.http.post(`${environment.apiBaseUrl}/users/create`, dto).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout() {
    this._user.set(null);
    this.clearStorage();
  }

  private persistToken(token: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageTokenKey, token);
  }
  private persistUser(u: AuthUser) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageUserKey, JSON.stringify(u));
  }
  private clearStorage() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.storageTokenKey);
    localStorage.removeItem(this.storageUserKey);
  }
}
