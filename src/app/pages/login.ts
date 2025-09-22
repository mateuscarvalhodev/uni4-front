import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submitting = false;
  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.form.invalid || this.submitting) return;
    this.form.setErrors(null);
    this.submitting = true;

    const { username, password } = this.form.value;

    this.auth
      .login$(username!, password!)
      .pipe(
        tap((ok) => {
          if (ok) {
            const ret = this.router.routerState.snapshot.root.queryParams['returnUrl'];
            this.router.navigateByUrl(ret || '/app/users');
          } else {
            this.form.setErrors({ invalidCreds: true });
          }
        }),
        catchError(() => {
          this.form.setErrors({ invalidCreds: true });
          return of(null);
        }),
        finalize(() => (this.submitting = false))
      )
      .subscribe();
  }
}
