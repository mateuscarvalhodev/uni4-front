import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

export interface Semester {
  id: number;
  number: number;
  curriculumId: number;
  subjects?: unknown[];
}

export type CreateSemesterDTO = Omit<Semester, 'id' | 'subjects'>;
export type UpdateSemesterDTO = Partial<CreateSemesterDTO>;

@Injectable({ providedIn: 'root' })
export class SemestersService {
  private http = inject(HttpClient);
  private base = `${(environment as any).coreBaseUrl || environment.apiBaseUrl}/semesters`;

  list(): Observable<Semester[]> {
    return this.http
      .get<Semester[]>(this.base)
      .pipe(map((rows) => rows.sort((a, b) => a.number - b.number)));
  }

  byCurriculum(curriculumId: number): Observable<Semester[]> {
    const params = new HttpParams().set('curriculumId', String(curriculumId));
    return this.http
      .get<Semester[]>(this.base, { params })
      .pipe(map((rows) => rows.sort((a, b) => a.number - b.number)));
  }

  get(id: number): Observable<Semester> {
    return this.http.get<Semester>(`${this.base}/${id}`);
  }

  create(dto: CreateSemesterDTO): Observable<Semester> {
    return this.http.post<Semester>(this.base, dto);
  }

  update(id: number, dto: UpdateSemesterDTO): Observable<Semester> {
    return this.http.put<Semester>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
