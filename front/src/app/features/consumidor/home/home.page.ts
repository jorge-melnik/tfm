import { Component, computed, inject, resource, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@shared/services/productos.service';
import { Producto } from '@shared/types/producto';
import { CurrencyPipe } from '@angular/common';
@Component({
  selector: 'app-home-consumidor',
  imports: [
    ButtonModule,
    DataViewModule,
    TagModule,
    IconField,
    InputIcon,
    SelectButton,
    FormsModule,
    CurrencyPipe,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  private readonly _productoService = inject(ProductosService);

  productosResource = resource({
    defaultValue: [] as Producto[],
    loader: () => this._productoService.getAll(),
  });

  // Señales para filtros
  filtroBusqueda = signal<string>('');
  layout = signal<'grid' | 'list'>('grid'); // Estado del diseño (tarjeta o lista)

  // Productos filtrados reactivamente
  productosFiltrados = computed(() => {
    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    const productos = this.productosResource.value();
    if (!this.productosResource.hasValue) return [];
    if (!busqueda) return productos;
    return productos.filter((p) => p.nombre.toLowerCase().includes(busqueda));
  });

  agregarAlCarrito(producto: any) {
    console.log('Agregado al carrito:', producto.nombre);
  }

  getSeverity(product: any) {
    switch (product.inventoryStatus) {
      case 'INSTOCK':
        return 'success';

      case 'LOWSTOCK':
        return 'warn';

      case 'OUTOFSTOCK':
        return 'danger';

      default:
        return null;
    }
  }
}
