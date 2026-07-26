import {
  Component,
  computed,
  inject,
  OnInit,
  resource,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@shared/services/productos.service';
import { environment } from '@env/environment';
import { ProductoCard } from '@shared/components/producto-card/producto.card';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { CategoriasService } from '@shared/services/categorias.service';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { Etiqueta } from '@shared/types/etiqueta';
import { ActivatedRoute,  ParamMap, Router } from '@angular/router';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { CarritoService } from '@shared/services/carrito.service';
import { ItemCarrito } from '@shared/types/item-carrito';
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';
import { SortOption } from '@shared/types/util';
import { EtiquetasService } from '@shared/services/etiquetas.service';

@Component({
  selector: 'app-home-consumidor',
  imports: [
    ButtonModule,
    DataViewModule,
    TagModule,
    SelectButton,
    FormsModule,
    ProductoCard,
    SelectModule,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
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
  public filtroBusqueda = signal<string>('');
  public categoriaSeleccionada = signal<string | undefined>(undefined);
  public subcategoriaSeleccionada = signal<string | undefined>(undefined);
  public etiquetasSeleccionadas = signal<string[]>([]);

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => {
      try {
        return this._categoriaService.getAll();
      }catch(error:any){
        this._dialogService.addError(error.message);
        return [] as Categoria [];
      }
    },
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    params: () => ({ slug_categoria: this.categoriaSeleccionada() }),
    loader: async ({ params }) => {
      try {
        const { slug_categoria } = params;
        if (!slug_categoria) return this._subcategoriaService.getAll();
        return this._categoriaService.getSubcategorias(slug_categoria);
      }catch(error:any){
        this._dialogService.addError(error.message);
        return [] as Subcategoria [];
      }
    },
  });

  public etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],
    params: () => ({
      slug_categoria: this.categoriaSeleccionada(),
      slug_subcategoria: this.subcategoriaSeleccionada(),
    }),
    loader: async ({ params }) => {      
      try {

        const { slug_categoria, slug_subcategoria } = params;

        if (slug_subcategoria) return this._subcategoriaService.getEtiquetas(slug_subcategoria);
        if (slug_categoria) return this._categoriaService.getEtiquetas(slug_categoria);

        //No hay ninguno de los slug
        return this._etiquetasService.getAll();
      }catch(error:any){
        this._dialogService.addError(error.message);
        return [] as Etiqueta [];
      }
    },
  });

  public productosResource = resource({
    params: () => ({
      
      slug_categoria: this.categoriaSeleccionada(),
      slug_subcategoria: this.subcategoriaSeleccionada(),
      etiquetas: this.etiquetasSeleccionadas(),
      limit: this.limit(),
      page: this.page(),
      sort: this.sortField(),
      sort_direction: this.sortOrder() === -1 ? 'DESC' : 'ASC',
      busqueda: this.filtroBusqueda(),
    }),
    loader: async ({ params }) => {
      const {
        slug_categoria,
        slug_subcategoria,
        etiquetas,
        limit,
        page,
        sort,
        sort_direction,
        busqueda,
      } = params;
      const queryParams: ApiQueryParams = {};
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };

      if (slug_categoria) queryParams['slug_categoria'] = slug_categoria;
      if (slug_subcategoria) queryParams['slug_subcategoria'] = slug_subcategoria;
      if (etiquetas) queryParams['etiquetas'] = etiquetas;
      if (busqueda) queryParams['busqueda'] = busqueda;

      return this._productoService.getBy({ queryParams, pagination });
    },
  });

  // Señales para filtros
  public layout = signal<'grid' | 'list'>('grid'); // Estado del diseño (tarjeta o lista)

  public page = signal(1);
  public limit = this._preferenciasStore.limit;
  public first = computed(() => (this.page() - 1) * this.limit());
  public sortKey = signal<string>('');
  public sortOrder = signal<number>(0);
  public sortField = signal<string>('');
  public sortOptions!: SortOption[];

  ngOnInit() {
    this.sortOptions = [
      { label: 'Menor a mayor precio', value: 'precio' },
      { label: 'Mayor a menor precio', value: '!precio' },
    ];
    const queryParams = this._route.snapshot.queryParamMap;
    const slug_categoria = queryParams.get('slug_categoria') ?? undefined;
    const slug_subcategoria = queryParams.get('slug_subcategoria') ?? undefined;
    const etiquetas = queryParams.getAll('etiquetas') ?? [];

    console.log({slug_categoria,slug_subcategoria,etiquetas});
    
    this.categoriaSeleccionada.set(slug_categoria);
    this.subcategoriaSeleccionada.set(slug_subcategoria);
    this.etiquetasSeleccionadas.set(etiquetas);
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
    const existente = this._carritoService.items
      .value()
      .find((i) => i.id_producto === item.id_producto);
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

  public onSortChange(event: any) {
    const value = event.value; // ej: 'precio' o '!precio'
    this.page.set(1);

    if (!value) {
      this.sortField.set('');
      this.sortOrder.set(1);
      return;
    }

    if (value.indexOf('!') === 0) {
      this.sortOrder.set(-1); // DESC
      this.sortField.set(value.substring(1));
    } else {
      this.sortOrder.set(1); // ASC
      this.sortField.set(value);
    }
  }

  onPageChange(event: any) {
    this._preferenciasStore.setLimit(event.rows);
    const nuevaPagina = event.first / event.rows + 1;
    this.page.set(nuevaPagina);
  }

  public onCategoriaChange(slug_categoria: string | undefined) {
    this.categoriaSeleccionada.set(slug_categoria);
    this.subcategoriaSeleccionada.set(undefined);
    this.etiquetasSeleccionadas.set([]);
    this.queryParamsChange();
  }

  public onSubcategoriaChange(
    slug_categoria: string | undefined,
    slug_subcategoria: string | undefined,
  ) {
    console.log("onSubcategoriaChange");
    this.etiquetasSeleccionadas.set([]);
    
    this.queryParamsChange();
  }

  public onEtiquetasChange(etiquetas: string[]) {
    console.log("onEtiquetasChange");
    this.queryParamsChange();
  }

  public queryParamsChange(){
    this.page.set(1); // Siempre volvemos a la página 1 al filtrar
    const slug_categoria = this.categoriaSeleccionada();
    const slug_subcategoria = this.subcategoriaSeleccionada();
    const etiquetas = this.etiquetasSeleccionadas();

    const queryParams : ApiQueryParams = {}
    if (slug_categoria) queryParams["slug_categoria"] = slug_categoria;
    if (slug_subcategoria) queryParams["slug_subcategoria"] = slug_subcategoria;
    if(etiquetas?.length>0) queryParams["etiquetas"] = etiquetas
    this._router.navigate(["consumidor"], {
      // relativeTo: this._route,
      queryParams,
      // queryParamsHandling: 'merge',
    });
  }
}
