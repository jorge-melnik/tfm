import { Routes } from '@angular/router';

export const consumidorRoutes: Routes = [
  {
    path: '',
    title: 'Consumidor',
    loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'carrito',
    title: 'Carrito',
    loadComponent: () =>
      import('@features/consumidor/carrito/carrito.page').then((m) => m.CarritoPage),
  },
  {
    path: 'compras',
    title: 'Compras',
    loadComponent: () =>
      import('@features/consumidor/compras/compras.page').then((m) => m.ComprasPage),
  },
];
