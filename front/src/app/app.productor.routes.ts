import { Routes } from '@angular/router';

export const productorRoutes: Routes = [
  {
    path: '',
    title: 'Productor',
    loadComponent: () => import('@features/productor/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'productos',
    title: 'Productos',
    loadComponent: () =>
      import('@features/productor/productos/productos.page').then((m) => m.ProductosPage),
  },
  {
    path: 'pedidos',
    title: 'pedidos',
    loadComponent: () =>
      import('@features/productor/pedidos/pedidos.page').then((m) => m.PedidosPage),
  },
];
