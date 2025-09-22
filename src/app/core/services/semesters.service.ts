import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

export interface Semester {
  id: number;
  courseId: number;
  index: number;
}

@Injectable({ providedIn: 'root' })
export class SemestersService {
  private http = inject(HttpClient);
  private base = `${(environment as any).coreBaseUrl || environment.apiBaseUrl}/semesters`;

  list(): Observable<Semester[]> {
    return this.http.get<Semester[]>(this.base);
  }

  byCourse(courseId: number): Observable<Semester[]> {
    const params = new HttpParams().set('courseId', String(courseId));
    return this.http
      .get<Semester[]>(this.base, { params })
      .pipe(map((rows) => rows.sort((a, b) => a.index - b.index)));
  }

  get(id: number): Observable<Semester> {
    return this.http.get<Semester>(`${this.base}/${id}`);
  }

  create(dto: Omit<Semester, 'id'>): Observable<Semester> {
    return this.http.post<Semester>(this.base, dto);
  }

  update(id: number, dto: Partial<Omit<Semester, 'id'>>): Observable<Semester> {
    return this.http.put<Semester>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
