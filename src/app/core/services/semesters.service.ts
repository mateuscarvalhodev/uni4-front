import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Semester {
  id: number;
  courseId: number;
  index: number;
}

const STORAGE_KEY = 'uni4.semesters';
const seed: Semester[] = [
  { id: 1, courseId: 1, index: 1 },
  { id: 2, courseId: 1, index: 2 },
  { id: 3, courseId: 2, index: 1 },
];

@Injectable({ providedIn: 'root' })
export class SemestersService {
  private store = new BehaviorSubject<Semester[]>(this.load());

  private load(): Semester[] {
    if (typeof window === 'undefined') return seed;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw) as Semester[];
    } catch {
      return seed;
    }
  }
  private persist(list: Semester[]) {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  list(): Observable<Semester[]> {
    return this.store.asObservable();
  }
  byCourse(courseId: number): Observable<Semester[]> {
    const r = this.store.value
      .filter((s) => s.courseId === courseId)
      .sort((a, b) => a.index - b.index);
    return of(r);
  }
  get(id: number): Observable<Semester> {
    return of(this.store.value.find((s) => s.id === id)!);
  }

  create(dto: Omit<Semester, 'id'>): Observable<Semester> {
    const list = [...this.store.value];
    const id = (list.at(-1)?.id ?? 0) + 1;
    const s: Semester = { id, ...dto };
    list.push(s);
    this.store.next(list);
    this.persist(list);
    return of(s);
  }
  update(id: number, dto: Partial<Omit<Semester, 'id'>>): Observable<Semester> {
    const list = this.store.value.map((s) => (s.id === id ? { ...s, ...dto } : s));
    const updated = list.find((s) => s.id === id)!;
    this.store.next(list);
    this.persist(list);
    return of(updated);
  }
  remove(id: number): Observable<void> {
    const list = this.store.value.filter((s) => s.id !== id);
    this.store.next(list);
    this.persist(list);
    return of(void 0);
  }
}
