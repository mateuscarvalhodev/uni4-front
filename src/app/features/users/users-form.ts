import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { User, Role } from '../../core/models/user';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-users-form',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './users-form.html',
  styleUrls: ['./users-form.scss'],
})
export class UsersForm implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(UsersService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  roles: Role[] = this.svc.roles();

  private id = signal<number | null>(null);
  isEdit = computed(() => this.id() !== null);

  saving = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: [''],
    role: ['' as Role | '', [Validators.required]],
  });

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');

    this.togglePasswordValidators(!paramId);

    if (paramId) {
      const id = Number(paramId);
      this.id.set(id);
      this.svc.get(id).subscribe((u) => {
        this.form.patchValue({
          name: u.name,
          email: u.email,
          username: u.username ?? '',
          role: u.role,
        });
      });
    }
  }

  private togglePasswordValidators(required: boolean) {
    const ctrl = this.form.controls.password;
    if (required) {
      ctrl.setValidators([Validators.required, Validators.minLength(6)]);
    } else {
      ctrl.clearValidators();
    }
    ctrl.updateValueAndValidity();
  }

  save() {
    this.error.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const v = this.form.getRawValue();

    if (this.isEdit()) {
      const id = this.id()!;
      const body = {
        name: v.name!,
        email: v.email!,
        role: (v.role as Role)!,
      };
      this.svc
        .update(id, body)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.router.navigate(['/app/users']),
          error: (e) => this.error.set(this.getErrMsg(e)),
        });
    } else {
      if (!v.password) {
        this.form.controls.password.markAsTouched();
        this.saving.set(false);
        return;
      }

      const body = {
        name: v.name!,
        email: v.email!,
        username: v.username!,
        password: v.password!,
        role: (v.role as Role)!,
      };

      this.svc
        .create(body)
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: () => this.router.navigate(['/app/users']),
          error: (e) => this.error.set(this.getErrMsg(e)),
        });
    }
  }

  private getErrMsg(e: any): string {
    const status = e?.status;
    if (status === 401) return 'Não autenticado. Faça login novamente.';
    if (status === 403) return 'Ação não permitida. Somente ADMIN pode criar usuários.';
    if (status === 400) return 'Dados inválidos. Verifique os campos.';
    return 'Erro inesperado ao salvar. Verifique os logs do servidor.';
  }
}
