import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../core/auth/auth.service';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (_route, state): boolean | UrlTree => {
  if (!environment.authEnabled) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
