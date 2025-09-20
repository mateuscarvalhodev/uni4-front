import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth/auth.service';

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

  showPassword = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    const ok = await this.auth.login(email!, password!);
    if (ok) {
      this.router.navigate(['/app/users']);
    } else {
      this.form.setErrors({ invalidCreds: true });
      this.form.controls.password.setErrors({ invalid: true });
      alert('Credenciais inválidas. Use dev@uni4.com / 123456');
    }
  }
}
