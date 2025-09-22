import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthUser, LoginRequestDTO, RegisterRequestDTO } from './auth.types';
import { Observable, catchError, map, of } from 'rxjs';

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

  hasAnyRole(...roles: string[]) {
    const r = (this._user()?.role ?? '').toUpperCase();
    return roles.map((x) => x.toUpperCase()).includes(r);
  }

  login$(username: string, password: string): Observable<boolean> {
    const body: LoginRequestDTO = {
      username: (username ?? '').trim(),
      password: (password ?? '').trim(),
    };
    return this.http.post<any>(`${environment.authBaseUrl}/login`, body).pipe(
      map((res) => {
        const token: string | undefined =
          res?.accessToken ?? res?.token ?? res?.jwt ?? res?.access_token ?? res?.id_token;
        if (!token) return false;
        this.persistToken(token);
        const fromJwt = this.buildUserFromToken(token);
        const user: AuthUser = fromJwt ?? { id: 0, name: body.username, email: '', role: 'ALUNO' };
        this._user.set(user);
        this.persistUser(user);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  register$(dto: RegisterRequestDTO & { role: string }): Observable<boolean> {
    const url = `${environment.apiBaseUrl}/auth/register`;
    const token = this.token();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    const roleApi = this.toApiRole(dto.role);
    const body = { ...dto, role: roleApi };

    return this.http.post(url, body, { headers }).pipe(
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
      const name = String(p['name'] ?? p['preferred_username'] ?? p['username'] ?? '');
      const email = String(p['email'] ?? '');
      const kcRoles: string[] = p['realm_access']?.['roles'] ?? [];
      const role = this.mapKeycloakRole(kcRoles, p['role'], p['roles']);

      return { id, name: name || email.split('@')[0] || 'Usuário', email, role };
    } catch {
      return null;
    }
  }

  private toApiRole(roleLike: string): 'administrador' | 'coordenador' | 'professor' | 'aluno' {
    const r = String(roleLike).toUpperCase();
    if (r.includes('ADMIN')) return 'administrador';
    if (r.includes('COORD')) return 'coordenador';
    if (r.includes('PROF')) return 'professor';
    return 'aluno';
  }

  private mapKeycloakRole(kcRoles: string[], single?: any, arrMaybe?: any): any {
    const pool = [
      ...(Array.isArray(kcRoles) ? kcRoles : []),
      ...(Array.isArray(arrMaybe) ? arrMaybe : []),
      ...(single ? [single] : []),
    ]
      .filter(Boolean)
      .map((r) => String(r).toLowerCase());

    if (pool.includes('administrador') || pool.includes('admin')) return 'ADMIN';
    if (pool.includes('coordenador')) return 'COORDENADOR';
    if (pool.includes('professor')) return 'PROFESSOR';
    if (pool.includes('aluno')) return 'ALUNO';
    return 'ALUNO';
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
}
