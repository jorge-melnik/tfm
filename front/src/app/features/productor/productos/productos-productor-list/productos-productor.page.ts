import { Component, computed, inject, model, OnInit, resource, signal } from '@angular/core';
import { ProductosTable } from '../../../../shared/components/productos-table/productos.table';
import { ProductosFilter } from '@shared/components/productos-filter/productos.filter';
import { ApiQueryParams } from '@shared/types/api.types';
import { environment } from '@env/environment';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';
import { Producto } from '@shared/types/producto';
import { ProductosProductorService } from '@shared/services/productos-productor.service';
import { DataViewModule } from 'primeng/dataview';
import { ProductoCard } from '@shared/components/producto-card/producto.card';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorStateComponent } from '@shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { PaginationStore } from '@shared/services/stores/pagination.store';

@Component({
  selector: 'app-productoos',
  imports: [
    ProductosTable,
    ProductosFilter,
    DataViewModule,
    ProductoCard,
    ErrorStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: './productos-productor.page.html',
  styleUrl: './productos-productor.page.css',
})
export class ProductosPage implements OnInit {
  private readonly _productoService = inject(ProductosProductorService);
  // private readonly _preferenciasStore = inject(PreferenciasStore);
  public readonly paginationStore = inject(PaginationStore);
  private readonly _userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _router = inject(Router);

  private readonly _route = inject(ActivatedRoute);

  public cdnUrl = environment.cdnUrl;

  //Signals para filtros.
  public busqueda = model<string>('');
  public categoria = model<string | undefined>(undefined);
  public subcategoria = model<string | undefined>(undefined);
  public etiquetas = signal<string[]>([]);
  // public page = signal<number>(1);
  // public limit = model<number>(this._preferenciasStore.limit());
  // public first = computed(() => ((this.page() || 1) - 1) * this.limit());
  // public sortKey = model<string>('');
  // public sortOrder = model<number>(0);
  // public sortField = model<string>('');
  public user = this._userStore.user;
  //Señales para el formulario de edición.

  public totalProductos = computed<number>(() => {
    return this.productosResource.value()?.meta.total || 0;
  });
  public productosResource = resource({
    params: () => ({
      categoria: this.categoria(),
      subcategoria: this.subcategoria(),
      etiquetas: this.etiquetas(),
      limit: this.paginationStore.limit(),
      page: this.paginationStore.page(),
      sort: this.paginationStore.sortField(),
      sort_direction: this.paginationStore.sortOrder() === -1 ? 'DESC' : 'ASC',
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
      console.log({ pagination });
      if (categoria) queryParams['categoria'] = categoria;
      if (subcategoria) queryParams['subcategoria'] = subcategoria;
      if (etiquetas) queryParams['etiquetas'] = etiquetas;
      if (busqueda) queryParams['busqueda'] = busqueda;

      const pathParams = { productor: user.username };

      try {
        const response = await this._productoService.getBy({ queryParams, pagination, pathParams });
        return response;
      } catch (error: any) {
        this._dialogService.addError(error.message);
        throw error;
      }
    },
  });

  public layout = signal<'grid' | 'list' | 'table'>('table'); // Estado del diseño (tarjeta o lista)

  ngOnInit(): void {
    this.paginationStore.setPage(1);
  }

  public cambioUnProducto(producto: Producto) {
    console.log('CambioUnProducto: ', { producto });
    this.productosResource.reload();
  }

  async gotToCrear() {
    console.log('gotToCrear');
    this._router.navigate(['crear'], {
      relativeTo: this._route,
    });
  }

  async gotToVer(p: Producto) {
    this._router.navigate([p.producto], {
      relativeTo: this._route,
    });
  }

  async gotToEditar(p: Producto) {
    this._router.navigate([p.producto, 'editar'], {
      relativeTo: this._route,
    });
  }

  //fixme todos estos gotTo y cambiar activo se podrían simplificar en dos métodos.
  async desactivarProducto(p: Producto) {
    console.log('desactivar producto');
    try {
      await this._productoService.desactivar(p.productor, p.producto);
      this.productosResource.reload();
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }
  async activarProducto(p: Producto) {
    console.log('activar producto');
    try {
      await this._productoService.activar(p.productor, p.producto);
      this.productosResource.reload();
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }
  async borrarProducto(p: Producto) {
    console.log('activar producto');
    try {
      await this._productoService.remove(p.producto, { productor: p.productor });
      this.productosResource.reload();
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }

  public onTitleClick(producto: Producto) {
    console.log('onTitleClick', producto.producto);
    const base = this._userStore.esProductor() ? '/productor' : '/consumidor/productores';
    this._router.navigate([base, producto.productor, 'productos', producto.producto]);
  }
}
