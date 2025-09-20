import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {
  if (!environment.authEnabled) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
