import { Routes } from '@angular/router';
import { loggedGuard } from '@core/guard/logged-guard';
import { unloggedGuard } from '@core/guard/unlogged-guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    title: 'Iniciar Sesión',
    canActivate: [unloggedGuard],
    loadComponent: () => import('@features/main/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    title: 'Registrarse',
    canActivate: [unloggedGuard],
    loadComponent: () =>
      import('@features/main/auth/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'unauthorized',
    title: 'No autorizado',
    canActivate: [loggedGuard],
    loadComponent: () =>
      import('@features/main/auth/unauthorized/unauthorized.component').then(
        (m) => m.UnauthorizedComponent,
      ),
  },
  {
    path: 'logout',
    title: 'Cerrar Sesión',
    canActivate: [loggedGuard],
    loadComponent: () =>
      import('@features/main/auth/logout/logout.component').then((m) => m.LogoutComponent),
  },
];
