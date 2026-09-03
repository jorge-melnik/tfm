import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { UserStore } from '@shared/services/stores/user.store';

export const productorRoutes: Routes = [
  {
    path: 'mis-datos',
    title: 'Mis Datos',
    loadComponent: () =>
      import('@features/productor/mis-datos/mis-datos.page').then((m) => m.MisDatosPage),
  },
  {
    path: 'mis-datos/ubicaciones',
    title: 'Mis Datos',
    loadComponent: () =>
      import('@features/ubicaciones/ubicaciones.page').then((m) => m.UbicacionesPage),
  },
  {
    path: ':username',
    children: [
      {
        path: '',
        title: 'Dashboard Productor',
        loadComponent: () => import('@features/productor/home/home.page').then((m) => m.HomePage),
      },

      {
        path: 'productos',
        title: 'Listar Productos',
        loadComponent: () =>
          import('@features/productor/productos/productos-productor-list/productos-productor.page').then(
            (m) => m.ProductosPage,
          ),
      },
      {
        path: 'productos/crear',
        title: 'Crear Producto',
        loadComponent: () =>
          import('@features/productor/productos/productos-productor-create/productos-productor-create.page').then(
            (m) => m.ProductosProductorCreatePage,
          ),
      },
      {
        path: 'productos/:producto',
        title: 'Ver Producto',
        loadComponent: () =>
          import('@features/productor/productos/productos-productor-view/productos-productor-view.page').then(
            (m) => m.ProductosProductorViewPage,
          ),
      },
      {
        path: 'productos/:producto/editar',
        title: 'Editar Producto',
        loadComponent: () =>
          import('@features/productor/productos/productos-productor-edit/productos-productor-edit.page').then(
            (m) => m.ProductosProductorEditPage,
          ),
      },

      {
        path: 'pedidos',
        title: 'pedidos',
        loadComponent: () =>
          import('@features/productor/pedidos/pedidos.page').then((m) => m.PedidosPage),
      },

      {
        path: 'consultas',
        title: 'Consultas',
        loadComponent: () =>
          import('@features/productor/consultas/consultas.page').then((m) => m.ConsultasPage),
      },

      {
        path: 'consultas/preguntas',
        title: 'Preguntas',
        loadComponent: () =>
          import('@features/productor/consultas/preguntas/preguntas.page').then(
            (m) => m.PreguntasPage,
          ),
      },
      {
        path: 'consultas/chats',
        title: 'Chats',
        loadComponent: () =>
          import('@features/productor/consultas/chats/chats.page').then((m) => m.ChatsPage),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: async () => {
      const userStore = inject(UserStore);
      const authService = inject(AuthService);
      const user = userStore.user();
      if (!user) {
        return '/'; //Si no hay usuario logueado, redirigimos al home
      }
      const { username, rol_actual } = user;
      if (rol_actual !== 'PRODUCTOR') {
        await authService.cambiarRolActualA('PRODUCTOR'); //Si el rol actual no es PRODUCTOR, lo cambiamos a PRODUCTOR
      }
      return '/productor/' + username;
    },
  },
];
