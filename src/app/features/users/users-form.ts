import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { User, Role } from '../../core/models/user';

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

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    role: ['' as Role | '', [Validators.required]],
  });

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      const id = Number(paramId);
      this.id.set(id);
      this.svc.get(id).subscribe((u) => {
        this.form.patchValue({ name: u.name, email: u.email, role: u.role });
      });
    }
  }

  save() {
    const value = this.form.value as Omit<User, 'id'>;
    if (this.isEdit()) {
      this.svc.update(this.id()!, value).subscribe(() => this.router.navigate(['/app/users']));
    } else {
      this.svc.create(value).subscribe(() => this.router.navigate(['/app/users']));
    }
  }
}
