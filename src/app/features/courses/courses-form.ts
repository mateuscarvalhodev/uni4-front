import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CoursesService, Course } from '../../core/services/courses.service';

@Component({
  standalone: true,
  selector: 'app-courses-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './courses-form.html',
  styleUrls: ['./courses-form.scss'],
})
export class CoursesForm implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(CoursesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private id = signal<number | null>(null);
  isEdit = computed(() => this.id() !== null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]],
  });

  ngOnInit() {
    const p = this.route.snapshot.paramMap.get('id');
    if (p) {
      const id = Number(p);
      this.id.set(id);
      this.svc.get(id).subscribe((c) => this.form.patchValue(c));
    }
  }

  save() {
    const v = this.form.value as Omit<Course, 'id'>;
    if (this.isEdit()) {
      this.svc.update(this.id()!, v).subscribe(() => this.router.navigate(['/app/cursos']));
    } else {
      this.svc.create(v).subscribe(() => this.router.navigate(['/app/cursos']));
    }
  }
}
