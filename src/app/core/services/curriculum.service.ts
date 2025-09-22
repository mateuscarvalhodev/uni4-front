import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Semester } from './semesters.service';
import { Discipline } from './disciplines.service';

export interface CurriculumItem {
  id: number;
  semesterId: number;
  disciplineId: number;
}

export interface SemesterWithDisciplines extends Semester {
  disciplines: { itemId: number; discipline: Discipline }[];
}

@Injectable({ providedIn: 'root' })
export class CurriculumService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/curriculum`;

  list(): Observable<CurriculumItem[]> {
    return this.http.get<CurriculumItem[]>(this.base);
  }

  add(semesterId: number, disciplineId: number): Observable<CurriculumItem> {
    return this.http.post<CurriculumItem>(this.base, { semesterId, disciplineId });
  }

  remove(itemId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${itemId}`);
  }
}
