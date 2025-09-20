import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, Role } from '../models/user';

const STORAGE_KEY = 'uni4.users';
const seed: User[] = [
  { id: 1, name: 'Dev Admin', email: 'dev@uni4.com', role: 'ADMIN' },
  { id: 2, name: 'Ana', email: 'ana@uni4.com', role: 'COORDENADOR' },
  { id: 3, name: 'Bruno', email: 'bruno@uni4.com', role: 'PROFESSOR' },
  { id: 4, name: 'Clara', email: 'clara@uni4.com', role: 'ALUNO' },
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  private store = new BehaviorSubject<User[]>(this.load());

  private load(): User[] {
    if (typeof window === 'undefined') return seed;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    try {
      return JSON.parse(raw) as User[];
    } catch {
      return seed;
    }
  }

  private persist(list: User[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }

  list(): Observable<User[]> {
    return this.store.asObservable();
  }

  get(id: number): Observable<User> {
    const u = this.store.value.find((x) => x.id === id)!;
    return of(u);
  }

  create(dto: Omit<User, 'id'>): Observable<User> {
    const list = [...this.store.value];
    const id = (list.at(-1)?.id ?? 0) + 1;
    const user: User = { id, ...dto };
    list.push(user);
    this.store.next(list);
    this.persist(list);
    return of(user);
  }

  update(id: number, dto: Partial<Omit<User, 'id'>>): Observable<User> {
    const list = this.store.value.map((u) => (u.id === id ? { ...u, ...dto } : u));
    const updated = list.find((u) => u.id === id)!;
    this.store.next(list);
    this.persist(list);
    return of(updated);
  }

  remove(id: number): Observable<void> {
    const list = this.store.value.filter((u) => u.id !== id);
    this.store.next(list);
    this.persist(list);
    return of(void 0);
  }

  roles(): Role[] {
    return ['ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO'];
  }
}
