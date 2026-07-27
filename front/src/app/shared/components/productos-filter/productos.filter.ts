import { Component, inject, input, model, output, resource } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '@shared/services/categorias.service';
import { DialogService } from '@shared/services/dialog.service';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { Etiqueta } from '@shared/types/etiqueta';
import { SortOption } from '@shared/types/util';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';

@Component({
  selector: 'app-productos-filter',
  imports: [FormsModule, Select, SelectButton],
  templateUrl: './productos.filter.html',
  styleUrl: './productos.filter.css',
})
export class ProductosFilter {
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetasService = inject(EtiquetasService);
  private readonly _dialogService = inject(DialogService);

  public filtroBusqueda = model<string>('');
  public categoriaSeleccionada = model<string | undefined>(undefined);
  public subcategoriaSeleccionada = model<string | undefined>(undefined);
  public etiquetasSeleccionadas = model<string[]>([]);

  public page = model.required();
  public sortKey = model.required<string>();
  public sortOrder = model.required<number>();
  public sortField = model.required<string>();
  public layout = model.required<'grid' | 'list'>(); // Estado del diseño (tarjeta o lista)

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => {
      try {
        return this._categoriaService.getAll();
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return [] as Categoria[];
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
        this._dialogService.addError(error.message);
        return [] as Subcategoria[];
      }
    },
  });

  public etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],
    params: () => ({
      categoria: this.categoriaSeleccionada(),
      subcategoria: this.subcategoriaSeleccionada(),
    }),
    loader: async ({ params }) => {
      try {
        const { categoria, subcategoria } = params;

        if (subcategoria) return this._subcategoriaService.getEtiquetas(subcategoria);
        if (categoria) return this._categoriaService.getEtiquetas(categoria);

        //No hay ninguno de los slug
        return this._etiquetasService.getAll();
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return [] as Etiqueta[];
      }
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
    console.log('onEtiquetasChange');

    this.filtroCambiado.emit();
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

    this.filtroCambiado.emit();
  }
}
