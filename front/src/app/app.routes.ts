import { Routes } from '@angular/router';
import { AdminLayout } from '@shared/layouts/admin/admin.layout';
import { MainLayout } from '@shared/layouts/main/main.layout';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@shared/layouts/main/main.layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        title: 'Home',
        loadComponent: () => import('@features/main/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'auth',
        loadChildren: () => import('./app.auth.routes').then((m) => m.authRoutes),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('@shared/layouts/admin/admin.layout').then((m) => m.AdminLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./app.admin.routes').then((m) => m.adminRoutes),
      },
    ],
  },
  {
    path: 'consumidor',
    loadComponent: () =>
      import('@shared/layouts/consumidor/consumidor.layout').then((m) => m.ConsumidorLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./app.consumidor.routes').then((m) => m.consumidorRoutes),
      },
    ],
  },
  {
    path: 'productor',
    loadComponent: () =>
      import('@shared/layouts/productor/productor.layout').then((m) => m.ProductorLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./app.productor.routes').then((m) => m.productorRoutes),
      },
    ],
  },
];
