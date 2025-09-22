import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService, Course } from '../../core/services/courses.service';
import {
  CurriculumService,
  Curriculum,
  CurriculumSemester,
  CurriculumSubject,
} from '../../core/services/curriculum.service';
import { DisciplinesService } from '../../core/services/disciplines.service';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-curriculum-builder',
  imports: [CommonModule, RouterLink],
  templateUrl: './curriculum-builder.html',
  styleUrls: ['./curriculum-builder.scss'],
})
export class CurriculumBuilder implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesSvc = inject(CoursesService);
  private curriculumSvc = inject(CurriculumService);
  private subjectsSvc = inject(DisciplinesService);

  courses = signal<Course[]>([]);
  courseId = signal<number | null>(null);
  curriculum = signal<Curriculum | null>(null);

  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  items = computed<CurriculumSemester[]>(() => {
    const cur = this.curriculum();
    if (!cur) return [];
    return [...(cur.semesters ?? [])].sort((a, b) => a.number - b.number);
  });

  ngOnInit() {
    this.coursesSvc.list().subscribe((cs) => this.courses.set(cs));

    this.route.paramMap.subscribe((params) => {
      const param = params.get('courseId');
      this.courseId.set(param ? Number(param) : null);
      this.loadForSelectedCourse();
    });
  }

  private loadForSelectedCourse() {
    const id = this.courseId();

    this.curriculum.set(null);
    this.error.set(null);

    if (!id) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.curriculumSvc
      .byCourse(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (cur) => this.curriculum.set(cur),
        error: (err) => {
          console.error('[curriculum] load error', err);
          this.error.set('Erro no servidor. Verifique os logs do backend.');
        },
      });
  }

  onCourseChange(value: string) {
    const id = value ? Number(value) : NaN;
    const next = isNaN(id) ? null : id;
    this.courseId.set(next);
    if (next) this.router.navigate(['/app/matriz', next]);
    else this.router.navigate(['/app/matriz']);
    this.loadForSelectedCourse();
  }

  removeSubject(subjectId: number) {
    if (!subjectId) return;
    if (!confirm('Remover disciplina deste semestre?')) return;
    this.subjectsSvc.remove(subjectId).subscribe(() => this.loadForSelectedCourse());
  }

  trackBySem = (_: number, s: CurriculumSemester) => s.id;
  trackBySub = (_: number, d: CurriculumSubject) => d.id;
}
