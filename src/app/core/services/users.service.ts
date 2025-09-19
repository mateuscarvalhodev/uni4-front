import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/users`;

  list(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }
  create(dto: Partial<User>): Observable<User> {
    return this.http.post<User>(this.base, dto);
  }
  update(id: number, dto: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.base}/${id}`, dto);
  }
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
