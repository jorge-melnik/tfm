import { Component, computed, inject, OnInit, resource, Signal, signal } from '@angular/core';
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
import { QueryParams } from '@shared/types/api.types';
import { Etiqueta } from '@shared/types/etiqueta';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
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
  private readonly _etiquetaService = inject(EtiquetasService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  private _queryParams = toSignal(this._route.queryParamMap, {
    initialValue: convertToParamMap({}),
  });
  public cdnUrl = environment.cdnUrl;

  //Signals para filtros.
  public filtroBusqueda = signal<string>('');
  public categoriaSeleccionada = signal<Categoria | null>(null);
  public subcategoriaSeleccionada = signal<Subcategoria | null>(null);
  public etiquetasSeleccionadas = signal<Etiqueta[]>([]);

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => this._categoriaService.getAll(),
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    params: () => ({ id_categoria: this.categoriaSeleccionada()?.id_categoria }),
    loader: async ({ params }) => {
      const { id_categoria } = params;

      const current = this._router.currentNavigation();
      console.log({ current });
      if (!id_categoria) return [];
      return this._subcategoriaService.getAll({ id_categoria });
    },
  });

  public etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],

    params: () => ({
      id_categoria: this.categoriaSeleccionada()?.id_categoria,
      id_subcategoria: this.subcategoriaSeleccionada()?.id_subcategoria,
    }),
    loader: async ({ params }) => {
      const { id_categoria, id_subcategoria } = params;
      const queryParams: QueryParams = {};
      if (id_categoria) queryParams['id_categoria'] = id_categoria;
      if (id_subcategoria) queryParams['id_subcategoria'] = id_subcategoria;
      if (Object.keys(queryParams).length === 0) return this._etiquetaService.getAll();
      const paginado = await this._etiquetaService.getBy({
        queryParams,
      });
      console.log({ paginado });
      return paginado.data;
    },
  });

  public productosResource = resource({
    defaultValue: [] as Producto[],
    loader: async () => {
      const categoria = this.categoriaSeleccionada();
      const subcategoria = this.subcategoriaSeleccionada();
      const id_etiquetas = this.etiquetasSeleccionadas().map((e) => e.id_etiqueta);
      const queryParams: QueryParams = {};
      if (categoria) queryParams['id_categoria'] = categoria.id_categoria;
      if (subcategoria) queryParams['id_subcategoria'] = subcategoria.id_subcategoria;
      if (id_etiquetas.length > 0) queryParams['id_etiquetas'] = id_etiquetas;
      if (Object.keys(queryParams).length === 0) return this._productoService.getAll();
      const paginado = await this._productoService.getBy(queryParams);
      return paginado.data;
    },
  });

  // Señales para filtros
  public layout = signal<'grid' | 'list'>('grid'); // Estado del diseño (tarjeta o lista)

  public rows = signal(10);
  public sortKey = signal<string>('');
  public sortOrder = signal<number>(0);
  public sortField = signal<string>('');
  public sortOptions!: SortOption[];

  // Productos filtrados reactivamente
  public productosFiltrados = computed(() => {
    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    const productos = this.productosResource.value();
    if (!this.productosResource.hasValue()) return [];
    if (!busqueda) return productos;
    return productos.filter((p) => p.nombre.toLowerCase().includes(busqueda));
  });

  ngOnInit() {
    this.sortOptions = [
      { label: 'Menor a mayor precio', value: 'precio' },
      { label: 'Mayor a menor precio', value: '!precio' },
    ];
    console.log({ queryParams: this._queryParams() });
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
}
