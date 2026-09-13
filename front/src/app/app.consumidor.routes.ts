import { Routes } from '@angular/router';

export const consumidorRoutes: Routes = [
  {
    path: 'mis-datos',
    title: 'Mis Datos',
    loadComponent: () =>
      import('@features/consumidor/mis-datos/mis-datos.page').then((m) => m.MisDatosPage),
  },
  {
    path: 'mis-datos/ubicaciones',
    title: 'Mis Datos',
    loadComponent: () =>
      import('@features/ubicaciones/ubicaciones.page').then((m) => m.UbicacionesPage),
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
        path: ':id_compra/pagos',
        title: 'Pagos compra',
        loadComponent: () =>
          import('@features/consumidor/compras/pagos/pagos.page').then((m) => m.PagosPage),
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
        path: ':id_compra/pedidos/:id_pedido',
        title: 'Finalizar compra',
        loadComponent: () =>
          import('@features/consumidor/compras/pedidos/detalle-pedido/detalle-pedido.page').then(
            (m) => m.DetallePedidoPage,
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
    path: 'productos',
    title: 'productos',
    loadComponent: () =>
      import('@features/consumidor/productos/productos.page').then((m) => m.ProductosPage),
  },
  {
    path: 'productores/:productor',
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Ver productor',
        loadComponent: () =>
          import('@features/consumidor/compras/productor/productor.page').then(
            (m) => m.ProductorPage,
          ),
      },
      {
        path: 'productos',
        pathMatch: 'full',
        title: 'Productos Productor',
        loadComponent: () =>
          import('@features/consumidor/productos/productos.page').then((m) => m.ProductosPage),
      },
      {
        path: 'productos/:producto',
        title: 'Ver Producto',
        loadComponent: () =>
          import('@features/productor/productos/productos-productor-view/productos-productor-view.page').then(
            (m) => m.ProductosProductorViewPage,
          ),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'productos',
  },
];
