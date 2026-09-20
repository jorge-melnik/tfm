import { Component, computed, inject, input, model, output, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '@shared/services/categorias.service';
import { DepartamentosService } from '@shared/services/departamentos.service';
import { DialogService } from '@shared/services/dialog.service';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { LocalidadsService } from '@shared/services/localidades.service';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { UbicacionActual } from '@shared/services/stores/ubicacion-actual';
import { UserStore } from '@shared/services/stores/user.store';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { UsuariosService } from '@shared/services/usuarios.service.ts';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { Etiqueta } from '@shared/types/etiqueta';
import { Coordenadas, Departamento, Localidad, Ubicacion } from '@shared/types/ubicacion';
import { SortOption } from '@shared/types/util';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-productos-filter',
  imports: [FormsModule, Select, SelectButton, SliderModule, InputTextModule],
  templateUrl: './productos.filter.html',

  styleUrl: './productos.filter.css',
})
export class ProductosFilter {
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetasService = inject(EtiquetasService);
  private readonly _dialogService = inject(DialogService);
  public readonly userStore = inject(UserStore);
  public readonly paginationStore = inject(PaginationStore);
  public readonly departamentosService = inject(DepartamentosService);
  public readonly localidadesService = inject(LocalidadsService);

  opcionesLayout = computed(() => {
    const base = ['grid', 'list'];
    return this.userStore.esProductor() ? [...base, 'table'] : base;
  });

  readonly opcionesFavoritos = [
    // { label: 'Todos', value: null, },
    { label: 'Favoritos', value: true },
    { label: 'No favoritos', value: false },
  ];

  public ubicaciones = model<Ubicacion[]>([]);
  public filtroBusqueda = model<string>('');
  public categoriaSeleccionada = model<string | undefined>(undefined);
  public subcategoriaSeleccionada = model<string | undefined>(undefined);
  public etiquetasSeleccionadas = model<string[]>([]);

  public departamentoSeleccionado = model<string | undefined>(undefined);
  public localidadSeleccionada = model<string | undefined>(undefined);

  public ubicacionSeleccionada = model<string | null>();
  public distanciaSeleccionada = model<number | null>();

  public favoritoSeleccionado = model<boolean | null>();

  public layout = model.required<'grid' | 'list' | 'table'>(); // Estado del diseño (tarjeta o lista)

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => {
      try {
        return this._categoriaService.getAll();
      } catch (error: any) {
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
        return [] as Categoria[];
        //FIXME: No corresponde try catch aquí.
      }
    },
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    params: () => ({ categoria: this.categoriaSeleccionada() }),
    loader: async ({ params }) => {
      try {
        const { categoria } = params;
        if (!categoria) return this._subcategoriaService.getAll();
        return this._categoriaService.getSubcategorias(categoria);
      } catch (error: any) {
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
        return [] as Subcategoria[];
      }
    },
  });

  public etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],
    params: () => {
      const categoria = this.categoriaSeleccionada();
      const subcategoria = this.subcategoriaSeleccionada();
      // if (!categoria && !subcategoria) return undefined;
      return {
        categoria,
        subcategoria,
      };
    },
    loader: async ({ params }) => {
      const { categoria, subcategoria } = params;

      if (subcategoria) return this._subcategoriaService.getEtiquetas(subcategoria);
      if (categoria) return this._categoriaService.getEtiquetas(categoria);

      //No hay ninguno de los slug.
      return this._etiquetasService.getAll();
    },
  });

  public departamentosResource = resource({
    defaultValue: [] as Departamento[],
    loader: async () => {
      return this.departamentosService.getAll();
    },
  });

  public localidadesResource = resource({
    defaultValue: [] as Localidad[],
    params: () => {
      const departamento = this.departamentoSeleccionado();
      if (!departamento) return undefined;
      return { departamento };
    },
    loader: async ({ params }) => {
      const { departamento } = params;
      if (!departamento) return [];
      return this.localidadesService.getAll({ departamento });
    },
  });

  public sortOptions: SortOption[] = [
    { label: 'Menor a mayor precio', value: 'precio' },
    { label: 'Mayor a menor precio', value: '!precio' },
  ];

  public filtroCambiado = output();

  public onCategoriaChange(categoria: string | undefined) {
    this.categoriaSeleccionada.set(categoria);
    this.subcategoriaSeleccionada.set(undefined);
    this.etiquetasSeleccionadas.set([]);
    this.filtroCambiado.emit();
  }

  public onSubcategoriaChange(categoria: string | undefined, subcategoria: string | undefined) {
    console.log('onSubcategoriaChange');
    this.etiquetasSeleccionadas.set([]);

    this.filtroCambiado.emit();
  }

  public onEtiquetasChange(etiquetas: string[]) {
    this.filtroCambiado.emit();
  }

  public onDepartamentoChange(departamento: string) {
    this.localidadSeleccionada.set(undefined);
    this.filtroCambiado.emit();
  }
}
