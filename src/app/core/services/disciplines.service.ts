import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Discipline {
  id: number;
  name: string;
  code: string;
}

const STORAGE_KEY = 'uni4.disciplines';
const seed: Discipline[] = [
  { id: 1, name: 'Algoritmos', code: 'ALG' },
  { id: 2, name: 'Estruturas de Dados', code: 'ED' },
  { id: 3, name: 'Banco de Dados', code: 'BD' },
  { id: 4, name: 'Engenharia de Requisitos', code: 'ER' },
];

@Injectable({ providedIn: 'root' })
export class DisciplinesService {
  private store = new BehaviorSubject<Discipline[]>(this.load());

  private load(): Discipline[] {
    if (typeof window === 'undefined') return seed;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw) as Discipline[];
    } catch {
      return seed;
    }
  }
  private persist(list: Discipline[]) {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  list(): Observable<Discipline[]> {
    return this.store.asObservable();
  }
  get(id: number): Observable<Discipline> {
    return of(this.store.value.find((d) => d.id === id)!);
  }

  create(dto: Omit<Discipline, 'id'>): Observable<Discipline> {
    const list = [...this.store.value];
    const id = (list.at(-1)?.id ?? 0) + 1;
    const d: Discipline = { id, ...dto };
    list.push(d);
    this.store.next(list);
    this.persist(list);
    return of(d);
  }
  update(id: number, dto: Partial<Omit<Discipline, 'id'>>): Observable<Discipline> {
    const list = this.store.value.map((d) => (d.id === id ? { ...d, ...dto } : d));
    const updated = list.find((d) => d.id === id)!;
    this.store.next(list);
    this.persist(list);
    return of(updated);
  }
  remove(id: number): Observable<void> {
    const list = this.store.value.filter((d) => d.id !== id);
    this.store.next(list);
    this.persist(list);
    return of(void 0);
  }
}
