import { Component, inject, input, model, OnInit, output, resource, signal } from '@angular/core';
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
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { Etiqueta } from '@shared/types/etiqueta';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { CategoriasService } from '@shared/services/categorias.service';
import { DialogService } from '@shared/services/dialog.service';
import { FormsModule } from '@angular/forms';
import { ProductosProductorService } from '@shared/services/productos-productor.service';

import { Plus } from '@primeicons/angular/plus';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-productos-table',
  imports: [
    SelectModule,
    InputNumberModule,
    TableModule,
    InputTagsModule,
    ButtonModule,
    InputTextModule,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    TimesIcon,
    BanIcon,
    FotoCarrusel,
    FormsModule,
    Plus,
    EmptyStateComponent,
  ],
  templateUrl: './productos.table.html',
  styleUrl: './productos.table.css',
})
export class ProductosTable implements OnInit {
  private _preferenciasStore = inject(PreferenciasStore);
  private readonly _productoService = inject(ProductosProductorService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _dialogService = inject(DialogService);
  public cdnUrl = environment.cdnUrl;

  public total = input.required<number>();
  public page = model.required<number>();
  public limit = model.required<number>();
  public first = input.required<number>();
  public productor = input.required<string>();

  public productos = input.required<Producto[]>();

  private productoVacio = {
    id_productor: '',
    id_subcategoria: 0,
    id_producto: 0,
    categoria: '',
    subcategoria: '',
    nombre: '',
    productor: '',
    producto: '',
    descripcion: '',
    precio: 0,
    cantidad_disponible: 0,
    etiquetas: [],
    fotos: [],
    id_etiquetas: [],
    activo: true,
  };

  public productoSeleccionado = signal<Producto>({ ...this.productoVacio });

  public agregarProducto = output();

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
    params: () => ({ producto: this.productoSeleccionado() }),
    loader: async ({ params }) => {
      try {
        const categoria = params.producto?.categoria;
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
      producto: this.productoSeleccionado(),
    }),
    loader: async ({ params }) => {
      try {
        const { producto } = params;
        const subcategoria = producto?.subcategoria;

        if (!subcategoria) return [];
        return this._subcategoriaService.getEtiquetas(subcategoria);
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return [] as Etiqueta[];
      }
    },
  });

  ngOnInit(): void {
    // this.productoSeleccionado.set(null);
  }

  onRowEditInit(producto: Producto) {
    this.productoSeleccionado.set({ ...producto });
    console.log('onRowEditInit');
  }

  async onRowEditSave(producto: Producto) {
    console.log('onRowEditSave');
    const productoActualizado = this.productoSeleccionado();

    if (!productoActualizado) {
      return;
    }
    try {
      const pathParams = { productor: producto.productor };
      await this._productoService.update(
        productoActualizado.producto,
        productoActualizado,
        pathParams,
      );
      this.productoSeleccionado.set({ ...this.productoVacio });
      this.cambioUnProducto.emit(productoActualizado);
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }

  onRowEditCancel(producto: Producto, index: number) {
    // this.productoSeleccionado.set(null);
    console.log('onRowEditCancel  ');
  }

  public cambioUnProducto = output<Producto>();
  // async submitForm() {
  //   console.log('submitForm');
  //   if (!this.productoForm().valid) {
  //     return;
  //   }
  //   const productoActualizado = this.productoForm().value();
  //   try {

  // const pathParams = {productor : producto.productor};
  //     await this._productoService.update(productoActualizado.id_producto, productoActualizado,pathParams);
  //     this.cambioUnProducto.emit(productoActualizado);
  //   } catch (error: any) {
  //     this._dialogService.addError(error.message);
  //   }
  // }
}
