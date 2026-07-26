import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  public filtroBusqueda = model<string>('');
  public categoriaSeleccionada = model<string | undefined>(undefined);
  public subcategoriaSeleccionada = model<string | undefined>(undefined);
  public etiquetasSeleccionadas = model<string[]>([]);

  public page = model.required();
  public sortKey = model.required<string>();
  public sortOrder = model.required<number>();
  public sortField = model.required<string>();
  public layout = model.required<'grid' | 'list'>(); // Estado del diseño (tarjeta o lista)

  public categorias = input.required<Categoria[]>();
  public subcategorias = input.required<Subcategoria[]>();
  public etiquetas = input.required<Etiqueta[]>();

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

  public onSubcategoriaChange(
    categoria: string | undefined,
    subcategoria: string | undefined,
  ) {
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
