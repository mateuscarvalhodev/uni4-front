import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SemestersService, Semester } from '../../core/services/semesters.service';
import { CoursesService, Course } from '../../core/services/courses.service';

@Component({
  standalone: true,
  selector: 'app-semesters-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './semesters-list.html',
  styleUrls: ['./semesters-list.scss'],
})
export class SemestersList implements OnInit {
  private svc = inject(SemestersService);
  private coursesSvc = inject(CoursesService);

  private list = signal<Semester[]>([]);
  private courses = signal<Course[]>([]);
  filterCourseId = signal<number | 'all'>('all');

  vm = computed(() => {
    const cid = this.filterCourseId();
    const rows = cid === 'all' ? this.list() : this.list().filter((s) => s.courseId === cid);
    const cmap = new Map(this.courses().map((c) => [c.id, c.name]));
    return rows.map((s) => ({ ...s, courseName: cmap.get(s.courseId) || `Curso ${s.courseId}` }));
  });

  ngOnInit() {
    this.svc.list().subscribe((d) => this.list.set(d));
    this.coursesSvc.list().subscribe((cs) => this.courses.set(cs));
  }

  remove(id: number) {
    if (confirm('Excluir semestre?')) this.svc.remove(id).subscribe();
  }

  setFilter(value: string) {
    if (value === 'all') this.filterCourseId.set('all');
    else this.filterCourseId.set(Number(value));
  }

  coursesOptions() {
    return this.courses();
  }
}
