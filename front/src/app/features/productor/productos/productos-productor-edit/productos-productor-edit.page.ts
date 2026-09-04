import { Component, inject, input, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from '@shared/services/dialog.service';
import { SelectModule } from 'primeng/select';
import { ProductoForm } from '@shared/components/producto-form/producto.form';
import { ProductosProductorService } from '@shared/services/productos-productor.service';
import { ImagenSlot, Producto } from '@shared/types/producto';
import { ProductoImagenesSelector } from '@shared/components/producto-imagenes-selector/producto-imagenes-selector';

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
    ProductoImagenesSelector,
  ],
  templateUrl: './productos-productor-edit.page.html',
  styleUrl: './productos-productor-edit.page.css',
})
export class ProductosProductorEditPage {
  private readonly _dialogService = inject(DialogService);
  private readonly _productosService = inject(ProductosProductorService);
  private readonly _router = inject(Router);

  private readonly _route = inject(ActivatedRoute);

  public readonly productoResource = resource({
    params: () => ({ productor: this.username(), producto: this.producto() }),
    loader: async ({ params }) => {
      const { productor, producto } = params;
      return this._productosService.getById(producto, { productor });
    },
  });
  // public readonly etiquetasStore = inject(EtiquetasStore);

  public username = input.required<string>();
  public producto = input.required<string>();

  public slots = signal<ImagenSlot[]>([]);

  public async guardarProducto(productoModificado: Producto) {
    const productor = this.username();
    const producto = this.producto();
    console.log({ productoModificado });
    try {
      await this._productosService.update(producto, productoModificado, { productor });
      const slots = this.slots();
      await this._productosService.setImagenes(productor, producto, slots);
      this.volver();
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }

  public volver() {
    this._router.navigate(['../..'], { relativeTo: this._route });
  }
}
