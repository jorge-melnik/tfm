import { Component, computed, inject, model, OnInit, resource, signal } from '@angular/core';
import { ProductosTable } from './components/productos/productos.table';
import { ProductosFilter } from '@shared/components/productos-filter/productos.filter';
import { ApiQueryParams } from '@shared/types/api.types';
import { environment } from '@env/environment';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { ProductosService } from '@shared/services/productos.service';
import { CategoriasService } from '@shared/services/categorias.service';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from '@shared/services/carrito.service';
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';
import { Etiqueta } from '@shared/types/etiqueta';

@Component({
  selector: 'app-productoos',
  imports: [ProductosTable, ProductosFilter],
  templateUrl: './productos.page.html',

  styleUrl: './productos.page.css',
})
export class ProductosPage implements OnInit {
  private readonly _productoService = inject(ProductosService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetasService = inject(EtiquetasService);
  private readonly _preferenciasStore = inject(PreferenciasStore);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _carritoService = inject(CarritoService);
  private readonly _userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);

  public cdnUrl = environment.cdnUrl;

  //Signals para filtros.
  public busqueda = model<string>('');
  public categoria = model<string | undefined>(undefined);
  public subcategoria = model<string | undefined>(undefined);
  public etiquetas = signal<string[]>([]);
  public page = signal<number>(1);
  public limit = model<number>(this._preferenciasStore.limit());
  public first = computed(() => ((this.page() || 1) - 1) * this.limit());
  public sortKey = model<string>('');
  public sortOrder = model<number>(0);
  public sortField = model<string>('');

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => {
      try {
        return this._categoriaService.getAll();
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return [] as Categoria[];
      }
    },
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    params: () => ({ categoria: this.categoria() }),
    loader: async ({ params }) => {
      try {
        const { categoria } = params;
        if (!categoria) return this._subcategoriaService.getAll();
        return this._categoriaService.getSubcategorias(categoria);
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return [] as Subcategoria[];
      }
    },
  });

  public etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],
    params: () => ({
      categoria: this.categoria(),
      subcategoria: this.subcategoria(),
    }),
    loader: async ({ params }) => {
      try {
        const { categoria, subcategoria } = params;

        if (subcategoria) return this._subcategoriaService.getEtiquetas(subcategoria);
        if (categoria) return this._categoriaService.getEtiquetas(categoria);

        //No hay ninguno de los slug
        return this._etiquetasService.getAll();
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return [] as Etiqueta[];
      }
    },
  });

  public totalProductos = computed<number>(() => {
    const productos = this.productosResource.value()?.data || [];
    return productos.length;
  });
  public productosResource = resource({
    params: () => ({
      categoria: this.categoria(),
      subcategoria: this.subcategoria(),
      etiquetas: this.etiquetas(),
      limit: this.limit(),
      page: this.page(),
      sort: this.sortField(),
      sort_direction: this.sortOrder() === -1 ? 'DESC' : 'ASC',
      busqueda: this.busqueda(),
      user: this._userStore.user(),
    }),
    loader: async ({ params }) => {
      const {
        user,
        categoria,
        subcategoria,
        etiquetas,
        limit,
        page,
        sort,
        sort_direction,
        busqueda,
      } = params;

      if (!user) throw new Error('Usuario no autenticado');

      const queryParams: ApiQueryParams = { id_productor: user.id_usuario };
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      // if (limit) pagination['limit'] = limit;
      // if (page) pagination['page'] = page;
      // if (sort) pagination['sort'] = sort;
      // if (sort_direction) pagination['sort_direction'] = sort_direction;

      if (categoria) queryParams['categoria'] = categoria;
      if (subcategoria) queryParams['subcategoria'] = subcategoria;
      if (etiquetas) queryParams['etiquetas'] = etiquetas;
      if (busqueda) queryParams['busqueda'] = busqueda;

      try {
        const response = await this._productoService.getBy({ queryParams, pagination });

        console.log({ response });

        return response;
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return { data: [], meta: { total: 0 } };
      }
    },
  });

  public layout = signal<'grid' | 'list'>('grid'); // Estado del diseño (tarjeta o lista)

  ngOnInit(): void {
    if (!this.limit()) this.limit.set(this._preferenciasStore.limit());
  }
}
