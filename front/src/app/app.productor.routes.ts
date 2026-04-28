import { Routes } from '@angular/router';

export const productorRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@features/admin/home/home.page').then((m) => m.HomePage),
  },
];
