import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User, Role } from '../models/user';
import { AuthService } from '../auth/auth.service';

type CreateUserDTO = {
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
};

type UpdateUserDTO = {
  name: string;
  email: string;
  role: Role;
};

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  private api = environment.apiBaseUrl;
  private usersBase = `${this.api}/users`;

  roles(): Role[] {
    return ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO'];
  }

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.usersBase);
  }

  get(id: number): Observable<User> {
    return this.http.get<User>(`${this.usersBase}/${id}`);
  }

  create(dto: CreateUserDTO): Observable<User> {
    const url = `${this.api}/auth/register`;
    const headers = this.buildAuthHeaders();

    const body = {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      password: dto.password,
      role: this.mapRoleToApi(dto.role),
    };

    return this.http.post<User>(url, body, { headers });
  }

  update(id: number, dto: UpdateUserDTO): Observable<User> {
    const headers = this.buildAuthHeaders();
    const body = {
      name: dto.name,
      email: dto.email,
      role: this.mapRoleToApi(dto.role),
    };
    return this.http.put<User>(`${this.usersBase}/${id}`, body, { headers });
  }

  remove(id: number): Observable<void> {
    const headers = this.buildAuthHeaders();
    return this.http.delete<void>(`${this.usersBase}/${id}`, { headers });
  }

  private buildAuthHeaders(): HttpHeaders {
    const token = this.auth.token();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  private mapRoleToApi(role: Role): 'administrador' | 'coordenador' | 'professor' | 'aluno' {
    switch (role) {
      case 'ADMIN':
        return 'administrador';
      case 'COORDENADOR':
        return 'coordenador';
      case 'PROFESSOR':
        return 'professor';
      case 'ALUNO':
      default:
        return 'aluno';
    }
  }
}
