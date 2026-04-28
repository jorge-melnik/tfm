import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    title: 'Administrador',
    loadComponent: () => import('@features/admin/home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'categorias',
    title: 'Categorias',
    loadComponent: () =>
      import('@features/admin/categorias/categorias.page').then((m) => m.CategoriasPage),
  },
  {
    path: 'etiquetas',
    title: 'Etiquetas',
    loadComponent: () =>
      import('@features/admin/etiquetas/etiquetas.page').then((m) => m.EtiquetasPage),
  },
];
