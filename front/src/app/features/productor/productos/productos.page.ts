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
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';
import { Etiqueta } from '@shared/types/etiqueta';
import { Producto } from '@shared/types/producto';
import { ProductosProductorService } from '@shared/services/productos-productor.service';

@Component({
  selector: 'app-productoos',
  imports: [ProductosTable, ProductosFilter],
  templateUrl: './productos.page.html',

  styleUrl: './productos.page.css',
})
export class ProductosPage implements OnInit {
  private readonly _productoService = inject(ProductosProductorService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetasService = inject(EtiquetasService);
  private readonly _preferenciasStore = inject(PreferenciasStore);
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
  public user = this._userStore.user;
  //Señales para el formulario de edición.

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

      if (categoria) queryParams['categoria'] = categoria;
      if (subcategoria) queryParams['subcategoria'] = subcategoria;
      if (etiquetas) queryParams['etiquetas'] = etiquetas;
      if (busqueda) queryParams['busqueda'] = busqueda;

      const pathParams = {productor : user.username};

      try {
        const response = await this._productoService.getBy({ queryParams, pagination, pathParams });

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

  public cambioUnProducto(producto: Producto) {
    console.log('CambioUnProducto: ', { producto });
    this.productosResource.reload();
  }
}
