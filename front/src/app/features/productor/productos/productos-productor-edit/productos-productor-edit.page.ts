import { Component, inject, input, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { Etiqueta } from '@shared/types/etiqueta';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { DialogService } from '@shared/services/dialog.service';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { CategoriasService } from '@shared/services/categorias.service';
import { SelectModule } from 'primeng/select';
import { ProductoForm } from '@shared/components/producto-form/producto.form';
import { EtiquetasStore } from '@shared/services/stores/etiquetas.store';
import { ProductosProductorService } from '@shared/services/productos-productor.service';

@Component({
  selector: 'app-productos-productor-edit',
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ButtonModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    SelectModule,
    ProductoForm,
  ],
  templateUrl: './productos-productor-edit.page.html',
  styleUrl: './productos-productor-edit.page.css',
})
export class ProductosProductorEditPage {
  private readonly _dialogService = inject(DialogService);
  private readonly _productosService = inject(ProductosProductorService);

  public readonly productoResource = resource({
    params: () => ({ productor: this.productor(), producto: this.producto() }),
    loader: async ({ params }) => {
      return this._productosService.getById(params.productor, params.producto);
    },
  });
  // public readonly etiquetasStore = inject(EtiquetasStore);

  public productor = input.required<string>();
  public producto = input.required<string>();

  public guardarProducto() {
    console.log('Guardar producto.');
  }
}
