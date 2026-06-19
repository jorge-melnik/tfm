import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  resource,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@shared/services/productos.service';
import { environment } from '@env/environment';
import { ProductoCard } from '@shared/components/producto-card/producto.card';
import { MultiSelectModule } from 'primeng/multiselect';
import { toSignal } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { CategoriasService } from '@shared/services/categorias.service';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { Etiqueta } from '@shared/types/etiqueta';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { CarritoService } from '@shared/services/carrito.service';
import { ItemCarrito } from '@shared/types/item-carrito';
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';

interface SortOption {
  label: string;
  value: string;
}

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
    MultiSelectModule,
  ],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _productoService = inject(ProductosService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _preferenciasStore = inject(PreferenciasStore);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _carritoService = inject(CarritoService);
  private readonly _userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);

  private _queryParams = toSignal(this._route.queryParamMap, {
    initialValue: convertToParamMap({}),
  });

  private _pathParams = toSignal(this._route.paramMap, {
    initialValue: convertToParamMap({}),
  });

  //Params
  public slug_categoria: InputSignal<string | undefined> = input();
  public slug_subcategoria: InputSignal<string | undefined> = input();

  public cdnUrl = environment.cdnUrl;

  //Signals para filtros.
  public filtroBusqueda = signal<string>('');
  public categoriaSeleccionada = signal<string | null>(null);
  public subcategoriaSeleccionada = signal<string | null>(null);
  public etiquetasSeleccionadas = signal<string[]>([]);

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => this._categoriaService.getAll(),
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    params: () => ({ slug_categoria: this._pathParams().get('slug_categoria') }),
    loader: async ({ params }) => {
      const { slug_categoria } = params;
      if (!slug_categoria) return [];
      return this._subcategoriaService.getAll({ slug_categoria });
    },
  });

  public etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],
    params: () => ({
      slug_categoria: this._pathParams().get('slug_categoria'),
      slug_subcategoria: this._pathParams().get('slug_subcategoria'),
    }),
    loader: async ({ params }) => {
      const { slug_categoria, slug_subcategoria } = params;
      if (!slug_categoria) return [];
      if (!slug_subcategoria) return this._categoriaService.getEtiquetas(slug_categoria);

      //Hay ambos slug
      return this._subcategoriaService.getEtiquetas(slug_categoria, slug_subcategoria);
    },
  });

  public productosResource = resource({
    params: () => ({
      slug_categoria: this._pathParams().get('slug_categoria'),
      slug_subcategoria: this._pathParams().get('slug_subcategoria'),
      etiquetas: this._queryParams().getAll('etiquetas'),
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
      console.log({ pagination });

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
    this.categoriaSeleccionada.set(this._pathParams().get('slug_categoria'));
    this.subcategoriaSeleccionada.set(this._pathParams().get('slug_subcategoria'));
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

  public onCategoriaChange(slug: string | null) {
    this.page.set(1);
    if (!slug) {
      this._router.navigate(['consumidor']);
      return;
    }
    this._router.navigate(['consumidor', slug]);
  }

  public onSubcategoriaChange(slug_categoria: string | null, slug_subcategoria: string | null) {
    this.page.set(1);
    if (!slug_subcategoria || !slug_categoria) {
      return this.onCategoriaChange(slug_categoria);
    }
    this._router.navigate(['consumidor', slug_categoria, slug_subcategoria]);
  }

  public onEtiquetasChange(etiquetas: string[]) {
    this.page.set(1); // Siempre volvemos a la página 1 al filtrar

    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        etiquetas: etiquetas.length > 0 ? etiquetas : null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
