import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  SemestersService,
  Semester,
  CreateSemesterDTO,
} from '../../core/services/semesters.service';
import { CoursesService, Course } from '../../core/services/courses.service';

@Component({
  standalone: true,
  selector: 'app-semesters-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './semesters-form.html',
  styleUrls: ['./semesters-form.scss'],
})
export class SemestersForm implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(SemestersService);
  private coursesSvc = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courses = signal<Course[]>([]);
  private id = signal<number | null>(null);
  isEdit = computed(() => this.id() !== null);

  form = this.fb.group({
    curriculumId: [null as number | null, [Validators.required]],
    number: [1, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.coursesSvc.list().subscribe((cs) => this.courses.set(cs));
    const p = this.route.snapshot.paramMap.get('id');
    if (p) {
      const id = Number(p);
      this.id.set(id);
      this.svc.get(id).subscribe((s) => {
        this.form.patchValue({
          curriculumId: s.curriculumId,
          number: s.number,
        });
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.value as CreateSemesterDTO;
    if (this.isEdit()) {
      this.svc.update(this.id()!, v).subscribe(() => this.router.navigate(['/app/semestres']));
    } else {
      this.svc.create(v).subscribe(() => this.router.navigate(['/app/semestres']));
    }
  }
}
