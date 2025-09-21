import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
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

const STORAGE_KEY = 'uni4.curriculum';
const seed: CurriculumItem[] = [
  { id: 1, semesterId: 1, disciplineId: 1 },
  { id: 2, semesterId: 2, disciplineId: 2 },
  { id: 3, semesterId: 1, disciplineId: 3 },
  { id: 4, semesterId: 3, disciplineId: 4 },
];

@Injectable({ providedIn: 'root' })
export class CurriculumService {
  private store = new BehaviorSubject<CurriculumItem[]>(this.load());

  private load(): CurriculumItem[] {
    if (typeof window === 'undefined') return seed;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw) as CurriculumItem[];
    } catch {
      return seed;
    }
  }
  private persist(list: CurriculumItem[]) {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  list(): Observable<CurriculumItem[]> {
    return this.store.asObservable();
  }

  add(semesterId: number, disciplineId: number): Observable<CurriculumItem> {
    const list = [...this.store.value];
    const id = (list.at(-1)?.id ?? 0) + 1;
    const item: CurriculumItem = { id, semesterId, disciplineId };
    list.push(item);
    this.store.next(list);
    this.persist(list);
    return of(item);
  }

  remove(itemId: number): Observable<void> {
    const list = this.store.value.filter((ci) => ci.id !== itemId);
    this.store.next(list);
    this.persist(list);
    return of(void 0);
  }
}
