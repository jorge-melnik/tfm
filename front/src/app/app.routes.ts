import { Routes } from '@angular/router';
import { MainLayout } from '@shared/layouts/main/main.layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('@features/main/main.page').then((m) => m.MainPage),
      },
      {
        path: 'auth',
        children: [
          {
            path: 'login',
            title: 'Iniciar Sesión',
            loadComponent: () => import('@features/auth/login/login.page').then((m) => m.LoginPage),
          },
          {
            path: 'register',
            title: 'Registrarse',
            loadComponent: () =>
              import('@features/auth/register/register.page').then((m) => m.RegisterPage),
          },
        ],
      },
    ],
  },
];
