import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Discipline {
  id: number;
  name: string;
  description: string;
  hours: number;
  semesterId: number;
}

@Injectable({ providedIn: 'root' })
export class DisciplinesService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/subjects`;

  list(): Observable<Discipline[]> {
    return this.http.get<Discipline[]>(this.base);
  }

  get(id: number): Observable<Discipline> {
    return this.http.get<Discipline>(`${this.base}/${id}`);
  }

  create(dto: Omit<Discipline, 'id'>): Observable<Discipline> {
    return this.http.post<Discipline>(this.base, dto);
  }

  update(id: number, dto: Omit<Discipline, 'id'>): Observable<Discipline> {
    return this.http.put<Discipline>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
