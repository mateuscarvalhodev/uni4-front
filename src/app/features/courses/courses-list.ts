import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesService, Course } from '../../core/services/courses.service';

@Component({
  standalone: true,
  selector: 'app-courses-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './courses-list.html',
  styleUrls: ['./courses-list.scss'],
})
export class CoursesList implements OnInit {
  private svc = inject(CoursesService);
  list = signal<Course[]>([]);
  open = signal<Record<number, boolean>>({});

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.svc.list().subscribe((rows) => {
      this.list.set(rows);
      const m: Record<number, boolean> = {};
      rows.forEach((c) => (m[c.id] = this.open()[c.id] ?? false));
      this.open.set(m);
    });
  }

  toggle(id: number) {
    const m = { ...this.open() };
    m[id] = !m[id];
    this.open.set(m);
  }

  isOpen(id: number) {
    return !!this.open()[id];
  }

  remove(id: number) {
    if (!confirm('Excluir curso?')) return;
    this.svc.remove(id).subscribe(() => this.reload());
  }
}
