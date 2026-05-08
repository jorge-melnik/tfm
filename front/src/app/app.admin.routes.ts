import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    title: 'Administrador',
    loadComponent: () => import('@features/admin/home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'categorias',
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Categorias',
        loadComponent: () =>
          import('@features/admin/categorias/categorias.page').then((m) => m.CategoriasPage),
      },

      {
        path: 'create',
        title: 'Categorias',
        loadComponent: () =>
          import('@features/admin/categorias/create/categoria-create.page').then(
            (m) => m.CategoriaCreatePage,
          ),
      },

      {
        path: ':id_categoria',
        title: 'Categorias',
        loadComponent: () =>
          import('@features/admin/categorias/update/categoria-update.page').then(
            (m) => m.CategoriaUpdatePage,
          ),
      },

      {
        path: ':id_categoria/subcategorias',
        title: 'Subcategorias',
        loadComponent: () =>
          import('@features/admin/categorias/subcategorias/subcategorias.page').then(
            (m) => m.SubcategoriasPage,
          ),
      },
    ],
  },
  {
    path: 'etiquetas',
    title: 'Etiquetas',
    loadComponent: () =>
      import('@features/admin/etiquetas/etiquetas.page').then((m) => m.EtiquetasPage),
  },
];
