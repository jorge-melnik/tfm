import { Routes } from '@angular/router';

export const consumidorRoutes: Routes = [
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
  {
    path: '',
    title: 'Consumidor',
    children: [
      {
        path: '',
        title: 'Consumidor',
        loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
      },

      {
        path: ':categoria/:subcategoria',
        title: 'Consumidor',
        loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
      },
      {
        path: ':categoria',
        title: 'Consumidor',
        loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
      },
    ],
  },
];
