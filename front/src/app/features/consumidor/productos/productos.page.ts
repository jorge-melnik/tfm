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
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';
import { ProductosFilter } from '@shared/components/productos-filter/productos.filter';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { Filter } from '@primeicons/angular';
import { Ubicacion } from '@shared/types/ubicacion';

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
    Filter,
  ],
  templateUrl: './productos.page.html',
  styleUrl: './productos.page.css',
})
export class ProductosPage implements OnInit {
  private readonly _productoService = inject(ProductosService);
  public readonly paginationStore = inject(PaginationStore);
  public readonly carritoService = inject(CarritoService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _carritoService = inject(CarritoService);
  private readonly _userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);

  public cdnUrl = environment.cdnUrl;

  mostrarFiltro = signal<boolean>(false);

  //Signals para filtros.
  public busqueda = signal<string>('');
  public categoria = signal<string | undefined>(undefined);
  public subcategoria = signal<string | undefined>(undefined);
  public etiquetas = signal<string[]>([]);
  public ubicacion = signal<Ubicacion | null>(null);
  public distancia = signal<number | null>(50);

  public departamento = signal<string | undefined>(undefined);
  public localidad = signal<string | undefined>(undefined);

  public productosResource = resource({
    params: () => ({
      categoria: this.categoria(),
      subcategoria: this.subcategoria(),
      etiquetas: this.etiquetas(),
      departamento: this.departamento(),
      localidad: this.localidad(),
      limit: this.paginationStore.limit(),
      page: this.paginationStore.page(),
      sort: this.paginationStore.sortField(),
      sort_direction: this.paginationStore.sortOrder() === -1 ? 'DESC' : 'ASC',
      busqueda: this.busqueda(),
      ubicacion: this.ubicacion(),
      distancia: this.distancia(),
    }),
    loader: async ({ params }) => {
      const {
        categoria,
        subcategoria,
        etiquetas,
        departamento,
        localidad,
        limit,
        page,
        sort,
        sort_direction,
        busqueda,
        ubicacion,
        distancia,
      } = params;
      const queryParams: ApiQueryParams = {};
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      // if (limit) pagination['limit'] = limit;
      // if (page) pagination['page'] = page;
      // if (sort) pagination['sort'] = sort;
      // if (sort_direction) pagination['sort_direction'] = sort_direction;

      if (categoria) queryParams['categoria'] = categoria;
      if (subcategoria) queryParams['subcategoria'] = subcategoria;
      if (etiquetas) queryParams['etiquetas'] = etiquetas;
      if (departamento) queryParams['departamento'] = departamento;
      if (localidad) queryParams['localidad'] = localidad;
      if (busqueda) queryParams['busqueda'] = busqueda;
      if (ubicacion && distancia) {
        queryParams['latitud'] = ubicacion.latitud;
        queryParams['longitud'] = ubicacion.longitud;
        queryParams['distancia'] = distancia * 1000;
      }

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

  public readonly totalRecords = computed(() => {
    return this.productosResource.value()?.meta?.total ?? 0;
  });

  readonly textoPaginacion = computed(() => {
    const total = this.totalRecords();
    if (total === 0) return 'No se encontraron productos';

    const first = this.paginationStore.first();
    const limit = this.paginationStore.limit();

    const desde = first + 1;
    const hasta = Math.min(first + limit, total);

    return `Mostrando ${desde} a ${hasta} de ${total} productos`;
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

  toggleFiltro(): void {
    this.mostrarFiltro.update((v) => !v);
  }
}
