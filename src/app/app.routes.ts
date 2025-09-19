// src/app/app.routes.ts
import { Routes, CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import Keycloak from 'keycloak-js';
import { environment } from '../environments/environment';

const authGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId) || !environment.authEnabled) return true;
  const kc = inject(Keycloak) as Keycloak;
  return !!kc.authenticated;
};

const roleGuard = (roles: string[]): CanActivateFn => {
  return async () => {
    const platformId = inject(PLATFORM_ID);
    if (!isPlatformBrowser(platformId) || !environment.authEnabled) return true;
    const kc = inject(Keycloak) as Keycloak;
    const token: any = kc.tokenParsed ?? {};
    const userRoles: string[] = token?.realm_access?.roles ?? [];
    return roles.some((r) => userRoles.includes(r));
  };
};

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home.page').then((m) => m.HomePage),
  },

  {
    path: 'users',
    loadComponent: () => import('./features/users/users-list').then((m) => m.UsersList),
  },
  // {
  //   path: 'matriz',
  //   canActivate: [authGuard],
  //   loadComponent: () => import('./pages/matriz.page').then((m) => m.MatrizPage),
  // },
  // {
  //   path: 'cursos',
  //   canActivate: [authGuard, roleGuard(['COORDENADOR', 'ADMIN'])],
  //   loadComponent: () => import('./pages/cursos.page').then((m) => m.CursosPage),
  // },
  { path: '**', redirectTo: '' },
];
