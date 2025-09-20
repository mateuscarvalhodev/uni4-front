import { Component, OnInit, inject, signal, computed } from '@angular/core';
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
  private courses = signal<Course[]>([]);
  vm = computed(() => this.courses());

  ngOnInit() {
    this.svc.list().subscribe((d) => this.courses.set(d));
  }

  remove(id: number) {
    if (confirm('Excluir curso?')) {
      this.svc.remove(id).subscribe();
    }
  }
}
