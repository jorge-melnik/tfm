import { Component, inject, input, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TrashIcon, PencilIcon, CheckIcon, TimesIcon, BanIcon } from 'primeng/icons';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTagsModule } from 'primeng/inputtags';
import { InputTextModule } from 'primeng/inputtext';
import { Producto } from '@shared/types/producto';
import { environment } from '@env/environment';
import { FotoCarrusel } from '@shared/components/foto-carrusel/foto.carrusel';
import { SortOption } from '@shared/types/util';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { Etiqueta } from '@shared/types/etiqueta';

@Component({
  selector: 'app-productos-table',
  imports: [
    SelectModule,
    InputNumberModule,
    TableModule,
    InputTagsModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    TimesIcon,
    BanIcon,
    FotoCarrusel,
  ],
  templateUrl: './productos.table.html',
  styleUrl: './productos.table.css',
})
export class ProductosTable implements OnInit {
  private _preferenciasStore = inject(PreferenciasStore);
  public cdnUrl = environment.cdnUrl;

  public total = input.required<number>();
  public page = model.required<number>();
  public limit = model.required<number>();
  public first = input.required<number>();

  public productos = input.required<Producto[]>();
  public categorias = input.required<Categoria[]>();
  public subcategorias = input.required<Subcategoria[]>();
  public etiquetas = input.required<Etiqueta[]>();

  public productoSeleccionado = signal<Producto | null>(null);

  ngOnInit(): void {
    this.productoSeleccionado.set(null);
  }

  onRowEditInit(producto: Producto) {
    this.productoSeleccionado.set({ ...producto });
    console.log('onRowEditInit');
  }

  onRowEditSave(producto: Producto) {
    this.productoSeleccionado.set(null);
    console.log('onRowEditSave');
  }

  onRowEditCancel(producto: Producto, index: number) {
    this.productoSeleccionado.set(null);
    console.log('onRowEditCancel  ');
  }

  onPageChange(event: any) {
    this._preferenciasStore.setLimit(event.rows);
    const nuevaPagina = event.first / event.rows + 1;
    this.page.set(nuevaPagina);
  }
}
