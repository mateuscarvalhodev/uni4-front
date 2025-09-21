import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app/users' },

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
        path: 'users/new',
        loadComponent: () => import('./features/users/users-form').then((m) => m.UsersForm),
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./features/users/users-form').then((m) => m.UsersForm),
      },

      {
        path: 'cursos',
        loadComponent: () => import('./features/courses/courses-list').then((m) => m.CoursesList),
      },
      {
        path: 'cursos/new',
        loadComponent: () => import('./features/courses/courses-form').then((m) => m.CoursesForm),
      },
      {
        path: 'cursos/:id/edit',
        loadComponent: () => import('./features/courses/courses-form').then((m) => m.CoursesForm),
      },

      {
        path: 'matriz',
        loadComponent: () =>
          import('./features/curriculum/curriculum-builder').then((m) => m.CurriculumBuilder),
      },
      {
        path: 'matriz/:courseId',
        loadComponent: () =>
          import('./features/curriculum/curriculum-builder').then((m) => m.CurriculumBuilder),
      },
      {
        path: 'matriz',
        loadComponent: () =>
          import('./features/curriculum/curriculum-builder').then((m) => m.CurriculumBuilder),
      },
      {
        path: 'matriz/:courseId',
        loadComponent: () =>
          import('./features/curriculum/curriculum-builder').then((m) => m.CurriculumBuilder),
      },
      {
        path: 'disciplinas',
        loadComponent: () =>
          import('./features/disciplines/disciplines-list').then((m) => m.DisciplinesList),
      },
      {
        path: 'disciplinas/new',
        loadComponent: () =>
          import('./features/disciplines/disciplines-form').then((m) => m.DisciplinesForm),
      },
      {
        path: 'disciplinas/:id/edit',
        loadComponent: () =>
          import('./features/disciplines/disciplines-form').then((m) => m.DisciplinesForm),
      },

      {
        path: 'semestres',
        loadComponent: () =>
          import('./features/semesters/semesters-list').then((m) => m.SemestersList),
      },
      {
        path: 'semestres/new',
        loadComponent: () =>
          import('./features/semesters/semesters-form').then((m) => m.SemestersForm),
      },
      {
        path: 'semestres/:id/edit',
        loadComponent: () =>
          import('./features/semesters/semesters-form').then((m) => m.SemestersForm),
      },

      { path: '', pathMatch: 'full', redirectTo: 'users' },
    ],
  },

  { path: 'login', loadComponent: () => import('./pages/login').then((m) => m.LoginPage) },
  { path: '**', redirectTo: 'app/users' },
];
