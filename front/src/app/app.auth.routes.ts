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
  {
    path: 'unauthorized',
    title: 'No autorizado',
    loadComponent: () =>
      import('@features/main/auth/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent,
      ),
  },
  {
    path: 'logout',
    title: 'Cerrar Sesión',
    loadComponent: () =>
      import('@features/main/auth/logout/logout.component').then((m) => m.LogoutComponent),
  },
];
