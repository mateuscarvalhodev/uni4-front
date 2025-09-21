import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoadingBarComponent } from '../shared/ui/loading-bar.component';
import { ToastsComponent } from '../shared/ui/toasts.component';
import { AuthService } from '../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LoadingBarComponent, ToastsComponent],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss'],
})
export class LayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.auth.user());
  role = computed(() => this.user()?.role ?? 'ALUNO');

  private hasRole = (...roles: string[]) => roles.includes(this.role());

  canViewUsers = () => this.hasRole('ADMIN');
  canManageCourses = () => this.hasRole('ADMIN', 'COORDENADOR');
  canManageDisciplines = () => this.hasRole('ADMIN', 'COORDENADOR');
  canManageSemesters = () => this.hasRole('ADMIN', 'COORDENADOR');
  canViewMatrix = () => this.hasRole('ADMIN', 'COORDENADOR', 'PROFESSOR', 'ALUNO');

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
