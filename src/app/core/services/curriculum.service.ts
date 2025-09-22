import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, map } from 'rxjs';

export interface CurriculumSubject {
  id: number;
  name: string;
  hours: number;
  semesterId: number;
}

export interface CurriculumSemester {
  id: number;
  number: number;
  curriculumId: number;
  subjects: CurriculumSubject[];
}

export interface Curriculum {
  id: number;
  academicYear: string;
  courseId: number;
  semesters: CurriculumSemester[];
}

export interface CreateCurriculumDTO {
  academicYear: string;
  courseId: number;
}

export interface UpdateCurriculumDTO {
  academicYear: string;
  courseId: number;
}

@Injectable({ providedIn: 'root' })
export class CurriculumService {
  private http = inject(HttpClient);
  private base = `${(environment as any).coreBaseUrl || environment.apiBaseUrl}/curriculum`;

  list(): Observable<Curriculum[]> {
    return this.http.get<Curriculum[]>(this.base);
  }

  byCourse(courseId: number): Observable<Curriculum | null> {
    return this.list().pipe(
      map((rows) => rows.filter((c) => c.courseId === courseId)),
      map((cands) => {
        if (!cands.length) return null;

        const pick = [...cands].sort((a, b) => {
          const aSem = a.semesters ?? [];
          const bSem = b.semesters ?? [];
          const aSemLen = aSem.length;
          const bSemLen = bSem.length;

          if (bSemLen !== aSemLen) return bSemLen - aSemLen;

          const aSubjects = aSem.reduce((n, s) => n + (s.subjects?.length ?? 0), 0);
          const bSubjects = bSem.reduce((n, s) => n + (s.subjects?.length ?? 0), 0);
          if (bSubjects !== aSubjects) return bSubjects - aSubjects;

          const aYear = Number(a.academicYear) || 0;
          const bYear = Number(b.academicYear) || 0;
          if (bYear !== aYear) return bYear - aYear;

          return (b.id ?? 0) - (a.id ?? 0);
        })[0];

        return pick ?? null;
      })
    );
  }

  get(id: number): Observable<Curriculum> {
    return this.http.get<Curriculum>(`${this.base}/${id}`);
  }

  create(dto: CreateCurriculumDTO): Observable<Curriculum> {
    return this.http.post<Curriculum>(this.base, dto);
  }

  update(id: number, dto: UpdateCurriculumDTO): Observable<Curriculum> {
    return this.http.put<Curriculum>(`${this.base}/${id}`, dto);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
