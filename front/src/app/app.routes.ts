import { Routes } from '@angular/router';
import { activeRoleGuard } from '@core/guard/active-role-guard';
import { hasNotRoleGuard } from '@core/guard/has-not-role-guard';
import { Rol } from '@shared/types/user.types';

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

      {
        canActivate: [hasNotRoleGuard('PRODUCTOR')],
        path: 'quiero/vender',
        loadComponent: () =>
          import('./features/main/quiero-vender/quiero-vender.component').then(
            (m) => m.QuieroVenderComponent,
          ),
      },
      {
        canActivate: [hasNotRoleGuard('CONSUMIDOR')],
        path: 'quiero/comprar',
        loadComponent: () =>
          import('./features/main/quiero-comprar/quiero-comprar.component').then(
            (m) => m.QuieroComprarComponent,
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('@shared/layouts/admin/admin.layout').then((m) => m.AdminLayout),
    canActivateChild: [activeRoleGuard('ADMIN' as Rol)],
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
    canActivateChild: [activeRoleGuard('CONSUMIDOR' as Rol)],
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
    canActivateChild: [activeRoleGuard('PRODUCTOR' as Rol)],
    children: [
      {
        path: '',
        loadChildren: () => import('./app.productor.routes').then((m) => m.productorRoutes),
      },
    ],
  },
];
