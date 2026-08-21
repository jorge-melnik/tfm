import { Component, computed, inject, model, OnInit, resource, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@shared/services/productos.service';
import { environment } from '@env/environment';
import { ProductoCard } from '@shared/components/producto-card/producto.card';
import { SelectModule } from 'primeng/select';
import { ApiQueryParams } from '@shared/types/api.types';
import { ActivatedRoute, Router } from '@angular/router';
import { CarritoService } from '@shared/services/carrito.service';
import { ItemCarrito } from '@shared/types/item-carrito';
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';
import { ProductosFilter } from '@shared/components/productos-filter/productos.filter';
import { PaginationStore } from '@shared/services/stores/pagination.store';

@Component({
  selector: 'app-home-consumidor',
  imports: [
    ButtonModule,
    DataViewModule,
    TagModule,
    FormsModule,
    ProductoCard,
    SelectModule,
    ProductosFilter,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _productoService = inject(ProductosService);
  public readonly paginationStore = inject(PaginationStore);
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
    }),
    loader: async ({ params }) => {
      const { categoria, subcategoria, etiquetas, limit, page, sort, sort_direction, busqueda } =
        params;
      const queryParams: ApiQueryParams = {};
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

  ngOnInit() {
    const queryParams = this._route.snapshot.queryParamMap;
    if (!this.paginationStore.page()) this.paginationStore.setPage(1);
    const etiquetas = queryParams.getAll('etiquetas');
    console.log({ etiquetas });
    if (!etiquetas) this.etiquetas.set(etiquetas);
    //TODO: faltan busqueda, limit, etc.
  }

  public async agregarAlCarrito(
    item: Pick<ItemCarrito, 'id_productor' | 'id_producto' | 'cantidad'>,
  ) {
    const usuario = this._userStore.user();
    if (!usuario) return;
    const itemConConsumidor = {
      id_consumidor: usuario.id_usuario,
      ...item,
    };
    const productos = this._carritoService.productos.value();
    const existente = productos.find((i) => i.id_producto === item.id_producto);
    try {
      if (!existente) await this._carritoService.addItem(itemConConsumidor);
      if (existente) {
        itemConConsumidor.cantidad = itemConConsumidor.cantidad + existente.cantidad;
        await this._carritoService.updateItem(itemConConsumidor);
      }
    } catch (error: any) {
      console.error(error);
      this._dialogService.addError(error.message);
    }
  }

  public queryParamsChange() {
    this.paginationStore.setPage(1); // Siempre volvemos a la página 1 al filtrar
    const categoria = this.categoria();
    const subcategoria = this.subcategoria();
    const etiquetas = this.etiquetas();
    const busqueda = this.busqueda();

    const queryParams: ApiQueryParams = {};
    if (categoria) queryParams['categoria'] = categoria;
    if (subcategoria) queryParams['subcategoria'] = subcategoria;
    if (etiquetas?.length > 0) queryParams['etiquetas'] = etiquetas;
    if (busqueda) queryParams['busqueda'] = busqueda;

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams,
      // queryParamsHandling: 'merge',
    });
  }
}
