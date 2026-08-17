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
    children: [
      {
        path: '',
        title: 'Mis Compras',
        loadComponent: () =>
          import('@features/consumidor/compras/compras.page').then((m) => m.ComprasPage),
      },
      {
        path: ':id_compra/pagar',
        title: 'Finalizar compra',
        loadComponent: () =>
          import('@features/consumidor/compras/compras-pagar/compras-pagar.page').then(
            (m) => m.ComprasPagarPage,
          ),
      },
    ],
  },
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Comprar',
        loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
      },

      {
        path: ':categoria/:subcategoria',
        title: 'Comprar',
        loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
      },
      {
        path: ':categoria',
        title: 'Comprar',
        loadComponent: () => import('@features/consumidor/home/home.page').then((m) => m.HomePage),
      },
    ],
  },
];
