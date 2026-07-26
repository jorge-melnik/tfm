import { Component, computed, inject, resource, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { TrashIcon, PencilIcon, CheckIcon, TimesIcon, BanIcon } from 'primeng/icons';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTagsModule } from 'primeng/inputtags';
import { InputTextModule } from 'primeng/inputtext';
import { Producto } from '@shared/types/producto';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { environment } from '@env/environment';
import { UserStore } from '@shared/services/stores/user.store';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { CategoriasService } from '@shared/services/categorias.service';
import { ProductosService } from '@shared/services/productos.service';
import { Checkbox } from 'primeng/checkbox';
import { FotoCarrusel } from '@shared/components/foto-carrusel/foto.carrusel';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { SortOption } from '@shared/types/util';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { ApiQueryParams } from '@shared/types/api.types';

@Component({
  selector: 'app-productos-table',
  imports: [
    SelectModule,
    InputNumberModule,
    TableModule,
    InputTagsModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    TimesIcon,
    BanIcon,
    FotoCarrusel,
  ],
  templateUrl: './productos.table.html',
  styleUrl: './productos.table.css',
})
export class ProductosTable {
  private readonly _productosService = inject(ProductosService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetaService = inject(EtiquetasService);
  private readonly _userStore = inject(UserStore);
  private readonly _preferenciasStore = inject(PreferenciasStore);

  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  public cdnUrl = environment.cdnUrl;

  public page = signal(1);
  public limit = this._preferenciasStore.limit;
  public first = computed(() => (this.page() - 1) * this.limit());
  public sortKey = signal<string>('');
  public sortOrder = signal<number>(0);
  public sortField = signal<string>('');
  public sortOptions!: SortOption[];

  private _queryParams = toSignal(this._route.queryParamMap, {
    initialValue: convertToParamMap({}),
  });

  private _pathParams = toSignal(this._route.paramMap, {
    initialValue: convertToParamMap({}),
  });

  // public productosResource = resource({
  //   defaultValue: [] as Producto[],
  //   loader: async () => {
  //     const user = this._userStore.user();
  //     if (!user) throw new Error('Usuario no autenticado');
  //     const productos = (
  //       await this._productosService.getBy({
  //         queryParams: {
  //           id_productor: user.id_usuario,
  //         },
  //       })
  //     ).data;
  //     return productos;
  //   },
  // });

  public productosResource = resource({
    params: () => ({
      limit: this.limit(),
      page: this.page(),
      sort: this.sortField(),
      sort_direction: this.sortOrder() === -1 ? 'DESC' : 'ASC',
    }),
    loader: async ({ params }) => {
      const user = this._userStore.user();
      if (!user) throw new Error('Usuario no autenticado');
      const { limit, page, sort, sort_direction } = params;
      const queryParams: ApiQueryParams = {
        limit,
        page,
        sort,
        sort_direction,
        id_productor: user.id_usuario,
      };
      return this._productosService.getBy({
        queryParams,
      });
    },
  });

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: () => this._categoriaService.getAll(),
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    loader: () => this._subcategoriaService.getAll(),
  });

  public etiquetasResource = resource({
    defaultValue: [],
    loader: async () => {
      const etiquetas = await this._etiquetaService.getAll();
      return etiquetas;
    },
  });

  public productoSeleccionado = signal<Producto | null>(null);

  onRowEditInit(producto: Producto) {
    this.productoSeleccionado.set({ ...producto });
    console.log('onRowEditInit');
  }

  onRowEditSave(producto: Producto) {
    this.productoSeleccionado.set(null);
    console.log('onRowEditSave');
  }

  onRowEditCancel(producto: Producto, index: number) {
    this.productoSeleccionado.set(null);
    console.log('onRowEditCancel  ');
  }

  onPageChange(event: any) {
    this._preferenciasStore.setLimit(event.rows);
    const nuevaPagina = event.first / event.rows + 1;
    this.page.set(nuevaPagina);
  }
}
