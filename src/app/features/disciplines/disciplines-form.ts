import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DisciplinesService, Discipline } from '../../core/services/disciplines.service';

@Component({
  standalone: true,
  selector: 'app-disciplines-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './disciplines-form.html',
  styleUrls: ['./disciplines-form.scss'],
})
export class DisciplinesForm implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(DisciplinesService);
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
      this.svc.get(id).subscribe((d) => this.form.patchValue(d));
    }
  }

  save() {
    const v = this.form.value as Omit<Discipline, 'id'>;
    if (this.isEdit()) {
      this.svc.update(this.id()!, v).subscribe(() => this.router.navigate(['/app/disciplinas']));
    } else {
      this.svc.create(v).subscribe(() => this.router.navigate(['/app/disciplinas']));
    }
  }
}
