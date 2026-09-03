import { Routes } from '@angular/router';

export const consumidorRoutes: Routes = [
  {
    path: 'mis-datos',
    title: 'Mis Datos',
    loadComponent: () =>
      import('@features/consumidor/mis-datos/mis-datos.page').then((m) => m.MisDatosPage),
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
    children: [
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
      {
        path: 'productor/:username',
        pathMatch: 'full',
        title: 'Ver productor',
        loadComponent: () =>
          import('@features/consumidor/compras/productor/productor.page').then(
            (m) => m.ProductorPage,
          ),
      },
      {
        path: '',
        pathMatch: 'full',
        title: 'Mis Compras',
        loadComponent: () =>
          import('@features/consumidor/compras/compras.page').then((m) => m.ComprasPage),
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
        path: '',
        pathMatch: 'full',
        redirectTo: 'productos',
      },
    ],
  },
];
