import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Course {
  id: number;
  name: string;
  code: string;
}

const STORAGE_KEY = 'uni4.courses';
const seed: Course[] = [
  { id: 1, name: 'Sistemas de Informação', code: 'SI' },
  { id: 2, name: 'Engenharia de Software', code: 'ES' },
];

@Injectable({ providedIn: 'root' })
export class CoursesService {
  private store = new BehaviorSubject<Course[]>(this.load());

  private load(): Course[] {
    if (typeof window === 'undefined') return seed;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw) as Course[];
    } catch {
      return seed;
    }
  }
  private persist(list: Course[]) {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  list(): Observable<Course[]> {
    return this.store.asObservable();
  }
  get(id: number): Observable<Course> {
    return of(this.store.value.find((c) => c.id === id)!);
  }

  create(dto: Omit<Course, 'id'>): Observable<Course> {
    const list = [...this.store.value];
    const id = (list.at(-1)?.id ?? 0) + 1;
    const c: Course = { id, ...dto };
    list.push(c);
    this.store.next(list);
    this.persist(list);
    return of(c);
  }
  update(id: number, dto: Partial<Omit<Course, 'id'>>): Observable<Course> {
    const list = this.store.value.map((c) => (c.id === id ? { ...c, ...dto } : c));
    const updated = list.find((c) => c.id === id)!;
    this.store.next(list);
    this.persist(list);
    return of(updated);
  }
  remove(id: number): Observable<void> {
    const list = this.store.value.filter((c) => c.id !== id);
    this.store.next(list);
    this.persist(list);
    return of(void 0);
  }
}
