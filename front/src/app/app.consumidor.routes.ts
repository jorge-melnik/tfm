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
        path: ':id_compra',
        title: 'Detalle compra',
        loadComponent: () =>
          import('@features/consumidor/compras/compra-detalle/compra-detalle.page').then(
            (m) => m.CompraDetallePage,
          ),
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
        path: 'productos',
        title: 'productos',
        loadComponent: () =>
          import('@features/consumidor/productos/productos.page').then((m) => m.ProductosPage),
      },
      {
        path: 'productos/:productor/:producto',
        title: 'productos',
        loadComponent: () =>
          import('@features/productor/productos/productos-productor-view/productos-productor-view.page').then(
            (m) => m.ProductosProductorViewPage,
          ),
      },
    ],
  },
];
