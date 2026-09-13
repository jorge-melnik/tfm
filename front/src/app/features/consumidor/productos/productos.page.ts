import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  model,
  OnInit,
  resource,
  signal,
} from '@angular/core';
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
import { Coordenadas, Ubicacion } from '@shared/types/ubicacion';
import { Producto } from '@shared/types/producto';
import { ConsumidoresService } from '@shared/services/consumidores.service';
import { LocalidadsService } from '@shared/services/localidades.service';
import { UbicacionActual } from '@shared/services/stores/ubicacion-actual';
import { UsuariosService } from '@shared/services/usuarios.service.ts';

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
  providers: [UbicacionActual],
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
  private readonly _usuarioService = inject(UsuariosService);
  private readonly _userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _consumidoresService = inject(ConsumidoresService);
  private readonly _localidadesService = inject(LocalidadsService);
  public readonly ubicacionActualStore = inject(UbicacionActual);
  public readonly userStore = inject(UserStore);
  public readonly localidadesService = inject(LocalidadsService);

  public cdnUrl = environment.cdnUrl;

  mostrarFiltro = signal<boolean>(false);

  public productor = input<string>(); //username del productor, cuando vemos los productos de un productor.
  //Signals para filtros.
  public busqueda = signal<string>('');
  public categoria = signal<string | undefined>(undefined);
  public subcategoria = signal<string | undefined>(undefined);
  public etiquetas = signal<string[]>([]);
  public ubicacion = computed(() =>
    this.ubicaciones().find((u) => u.nombre === this.nombreUbicacionSeleccionada()),
  );
  public nombreUbicacionSeleccionada = signal<string | null>(null);

  public latitud = computed(() => this.ubicacion()?.latitud);
  public longitud = computed(() => this.ubicacion()?.longitud);

  public distancia = signal<number | null>(50);

  public favorito = signal<boolean | null>(null);

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
      latitud: this.latitud(),
      longitud: this.longitud(),
      distancia: this.distancia(),
      favorito: this.favorito(),
      productor: this.productor(),
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
        latitud,
        longitud,
        distancia,
        favorito,
        productor,
      } = params;
      const queryParams: ApiQueryParams = {};
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };

      if (categoria) queryParams['categoria'] = categoria;
      if (subcategoria) queryParams['subcategoria'] = subcategoria;
      if (etiquetas) queryParams['etiquetas'] = etiquetas;
      if (departamento) queryParams['departamento'] = departamento;
      if (localidad) queryParams['localidad'] = localidad;
      if (busqueda) queryParams['busqueda'] = busqueda;
      if (latitud && longitud && distancia) {
        queryParams['latitud'] = latitud;
        queryParams['longitud'] = longitud;
        queryParams['distancia'] = distancia * 1000;
      }
      if (productor) queryParams['productor'] = productor;
      console.log({ favorito });
      if (favorito !== undefined && favorito !== null) queryParams['favorito'] = favorito!;

      try {
        const response = await this._productoService.getBy({ queryParams, pagination });

        console.log({ response });

        return response;
      } catch (error: any) {
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
        return { data: [], meta: { total: 0 } };
      }
    },
  });

  private ubicacionAdicionalInicial = signal<Ubicacion | null>(null);

  private ubicacionesResource = resource({
    params: () => {
      const user = this.userStore.user();
      if (!user) return undefined;
      const username = user.username;
      const ubicacionActual: Coordenadas | null = this.ubicacionActualStore.ubicacion();
      const ubicacionAdicionalInicial = this.ubicacionAdicionalInicial();
      return {
        ubicacionAdicionalInicial,
        username,
        latitud: ubicacionActual?.latitud,
        longitud: ubicacionActual?.longitud,
      };
    },
    loader: async ({ params }) => {
      const { ubicacionAdicionalInicial, username, latitud, longitud } = params;
      const ubicaciones = await this._usuarioService.getUbicaciones(username);
      if (latitud && longitud) {
        const nuevaUbicacion = await this.localidadesService.getNuevaUbicacionFromCoordenada(
          latitud,
          longitud,
        );
        nuevaUbicacion.nombre = 'Ubicación actual';
        ubicaciones.push(nuevaUbicacion);
      }
      if (ubicacionAdicionalInicial) {
        ubicaciones.push(ubicacionAdicionalInicial);
      }
      return ubicaciones;
    },
  });

  public ubicaciones = computed(() => {
    return this.ubicacionesResource.value() || [];
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

  async ngOnInit() {
    const queryParams = this._route.snapshot.queryParamMap;

    if (!this.paginationStore.page()) this.paginationStore.setPage(1);

    const departamento = queryParams.get('departamento');
    if (departamento) this.departamento.set(departamento);

    const etiquetas = queryParams.getAll('etiquetas');
    if (etiquetas) this.etiquetas.set(etiquetas);

    const categoria = queryParams.get('categoria');
    if (categoria) this.categoria.set(categoria);

    const subcategoria = queryParams.get('subcategoria');
    if (subcategoria) this.subcategoria.set(subcategoria);

    const busqueda = queryParams.get('busqueda');
    if (busqueda) this.busqueda.set(busqueda);

    const ubicacion = queryParams.get('ubicacion');
    const distancia = queryParams.get('distancia');
    const latitud = queryParams.get('latitud');
    const longitud = queryParams.get('longitud');
    //FIXME: Faltaría crear una ubicación ficticia para que quede seleccionada

    if (distancia) {
      if (latitud && longitud) {
        const ubicacion = await this._localidadesService.getNuevaUbicacionFromCoordenada(
          parseFloat(latitud),
          parseFloat(longitud),
        );
        ubicacion.nombre = 'Coordenadas URL';
        this.ubicacionAdicionalInicial.set(ubicacion);
        this.nombreUbicacionSeleccionada.set(ubicacion.nombre);
      } else if (ubicacion) {
        this.nombreUbicacionSeleccionada.set(ubicacion);
      }

      this.distancia.set(parseInt(distancia));
    }

    const localidad = queryParams.get('localidad');
    if (localidad) this.localidad.set(localidad);

    //TODO: faltan busqueda, limit, etc.
  }

  public queryParamsChange() {
    this.paginationStore.setPage(1); // Siempre volvemos a la página 1 al filtrar
    const categoria = this.categoria();
    const subcategoria = this.subcategoria();
    const etiquetas = this.etiquetas();
    const busqueda = this.busqueda();
    const departamento = this.departamento();
    const localidad = this.localidad();
    const latitud = this.latitud();
    const longitud = this.longitud();
    const distancia = this.distancia();
    const ubicacion = this.nombreUbicacionSeleccionada();

    const queryParams: ApiQueryParams = {};
    if (categoria) queryParams['categoria'] = categoria;
    if (subcategoria) queryParams['subcategoria'] = subcategoria;
    if (etiquetas?.length > 0) queryParams['etiquetas'] = etiquetas;
    if (busqueda) queryParams['busqueda'] = busqueda;
    if (departamento) queryParams['departamento'] = departamento;
    if (localidad) queryParams['localidad'] = localidad;
    if (ubicacion && latitud && longitud && distancia) {
      if (ubicacion === 'Ubicación actual' || ubicacion === 'Coordenadas URL') {
        queryParams['latitud'] = latitud;
        queryParams['longitud'] = longitud;
      } else {
        queryParams['ubicacion'] = ubicacion;
      }
      queryParams['distancia'] = distancia;
    }

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams,
      // queryParamsHandling: 'merge',
    });
  }

  toggleFiltro(): void {
    this.mostrarFiltro.update((v) => !v);
  }

  public async onCambiaFavorito(producto: Producto) {
    console.log('CAMBIA FAVORITO ' + producto.nombre);
    const user = this._userStore.user();
    if (producto.favorito === false && user) {
      await this._consumidoresService.addFavorito(
        user.id_usuario,
        user.username,
        producto.id_producto,
      );
    }
    if (producto.favorito === true && user) {
      await this._consumidoresService.removeFavorito(user.username, producto.id_producto);
    }
    this.productosResource.reload();
  }

  public onTitleClick(producto: Producto) {
    console.log('onTitleClick', producto.producto);
    const base = this._userStore.esProductor() ? '/productor' : '/consumidor/productores';
    this._router.navigate([base, producto.productor, 'productos', producto.producto]);
  }
}
