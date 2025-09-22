import { Component, OnInit, signal, inject } from '@angular/core';
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
  expanded = signal<Record<number, boolean>>({});

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.svc.list().subscribe((rows) => this.list.set(rows));
  }

  toggle(id: number) {
    const m = { ...this.expanded() };
    m[id] = !m[id];
    this.expanded.set(m);
  }

  remove(id: number) {
    if (!confirm('Excluir curso?')) return;
    this.svc.remove(id).subscribe(() => this.reload());
  }

  isOpen(id: number) {
    return !!this.expanded()[id];
  }
}
