import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);

  if (!isPlatformBrowser(platformId)) return next(req);
  if (!req.url.startsWith(environment.apiBaseUrl)) return next(req);

  const token = auth.token();
  if (!token) return next(req);

  const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(authReq);
};
