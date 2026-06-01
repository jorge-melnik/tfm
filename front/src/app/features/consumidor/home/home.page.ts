import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  OnInit,
  resource,
  Signal,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@shared/services/productos.service';
import { Producto } from '@shared/types/producto';
import { environment } from '@env/environment';
import { ProductoCard } from '@shared/components/producto-card/producto.card';
import { SelectItem } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { toSignal } from '@angular/core/rxjs-interop';
interface SortOption {
  label: string;
  value: string;
}
import { SelectModule } from 'primeng/select';
import { CategoriasService } from '@shared/services/categorias.service';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { PathParams, QueryParams } from '@shared/types/api.types';
import { Etiqueta } from '@shared/types/etiqueta';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';

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
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _productoService = inject(ProductosService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _pathParams = toSignal(this._route.paramMap, {
    initialValue: convertToParamMap({}),
  });

  public slug_categoria: InputSignal<string | undefined> = input();
  public slug_subcategoria: InputSignal<string | undefined> = input();

  public cdnUrl = environment.cdnUrl;

  //Signals para filtros.
  public filtroBusqueda = signal<string>('');
  public categoriaSeleccionada = signal<string | null>(null);
  public subcategoriaSeleccionada = signal<string | null>(null);
  public etiquetasSeleccionadas = signal<Etiqueta[]>([]);

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
      console.log({ params });
      const { slug_categoria, slug_subcategoria } = params;
      console.log({
        slug_categoria,
        slug_subcategoria,
      });
      if (!slug_categoria) return [];
      if (!slug_subcategoria) return this._categoriaService.getEtiquetas(slug_categoria);

      //Hay ambos slug
      return this._subcategoriaService.getEtiquetas(slug_categoria, slug_subcategoria);
    },
  });

  public productosResource = resource({
    params: () => ({
      id_categoria: this._pathParams().get('id_categoria'),
      id_subcategoria: this._pathParams().get('id_subcategoria'),
      limit: this.limit(),
      page: this.page(),
    }),
    loader: async ({ params }) => {
      const { id_categoria, id_subcategoria, limit, page } = params;
      const queryParams: QueryParams = {};

      const pagination: QueryParams = { limit, page };

      if (id_categoria) queryParams['id_categoria'] = id_categoria;
      if (id_subcategoria) queryParams['id_subcategoria'] = id_subcategoria;

      return this._productoService.getBy({ queryParams, pagination });
    },
  });

  // Señales para filtros
  public layout = signal<'grid' | 'list'>('grid'); // Estado del diseño (tarjeta o lista)

  public page = signal(1);
  public limit = signal(10);
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

  public agregarAlCarrito(producto: any) {
    console.log('Agregado al carrito:', producto.nombre);
  }

  public onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder.set(-1);
      this.sortField.set(value.substring(1, value.length));
      this.sortKey.set(value);
    } else {
      this.sortOrder.set(1);
      this.sortField.set(value);
      this.sortKey.set(value);
    }
  }

  public log(m: any) {
    console.log(m);
  }

  onPageChange(event: any) {
    this.limit.set(event.rows);
    const nuevaPagina = event.first / event.rows + 1;
    this.page.set(nuevaPagina);
  }
}
