import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    title: 'Iniciar Sesión',
    loadComponent: () => import('@features/main/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    title: 'Registrarse',
    loadComponent: () =>
      import('@features/main/auth/register/register.page').then((m) => m.RegisterPage),
  },
];
