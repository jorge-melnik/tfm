import { Routes } from '@angular/router';

export const consumidorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/admin/home/home.page').then((m) => m.HomePage),
  },
];
