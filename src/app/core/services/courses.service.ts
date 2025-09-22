import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  code: string;
}

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private http = inject(HttpClient);
  private base = `${(environment as any).coreBaseUrl || environment.apiBaseUrl}/courses`;

  list(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base);
  }

  get(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.base}/${id}`);
  }

  create(dto: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(this.base, dto);
  }

  update(id: number, dto: Partial<Omit<Course, 'id'>>): Observable<Course> {
    return this.http.put<Course>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
