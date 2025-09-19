import { CanActivateFn } from '@angular/router';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {
  if (!environment.authEnabled) return true;
  return true;
};
