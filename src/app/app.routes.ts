import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login').then((m) => m.LoginPage) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'users',
        loadComponent: () => import('./features/users/users-list').then((m) => m.UsersList),
      },
      {
        path: 'matriz',
        loadComponent: () => import('./pages/matriz.page').then((m) => m.MatrizPage),
      },
      {
        path: 'cursos',
        loadComponent: () => import('./pages/cursos.page').then((m) => m.CursosPage),
      },
      { path: '', pathMatch: 'full', redirectTo: 'users' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
