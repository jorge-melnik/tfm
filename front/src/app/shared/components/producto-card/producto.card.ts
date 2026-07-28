import { Component, input, output, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FotoCarrusel } from '../foto-carrusel/foto.carrusel';
import { Producto } from '@shared/types/producto';
import { TooltipModule } from 'primeng/tooltip';
import { ItemCarrito } from '@shared/types/item-carrito';
import { UserStore } from '@shared/services/stores/user.store';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-producto-card',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, FotoCarrusel, TooltipModule, Menu],
  templateUrl: './producto.card.html',

  styleUrl: './producto.card.css',
})
export class ProductoCard {
  private userStore = inject(UserStore);

  public esProductor = computed(() => this.userStore.user()?.rol_actual === 'PRODUCTOR');

  producto = input.required<Producto>();
  layout = input<'grid' | 'list'>('grid'); // <-- Recibe el modo del DataView
  cdnUrl = input.required<string>();

  agregarAlCarrito = output<Pick<ItemCarrito, 'id_productor' | 'id_producto' | 'cantidad'>>();
  verProducto = output<string>();
  editarProducto = output<string>();
  borrarProducto = output<string>();
  desactivarProducto = output<string>();
  activarProducto = output<string>();

  itemsProductor = computed<MenuItem[]>(() => {
    const prod = this.producto();
    return [
      {
        label: 'Ver detalle',
        icon: 'pi pi-eye',
        command: () => this.verProducto.emit(prod.producto),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editarProducto.emit(prod.producto),
      },
      {
        label: prod.activo ? 'Desactivar' : 'Activar',
        icon: prod.activo ? 'pi pi-ban' : 'pi pi-check-circle',
        command: () =>
          prod.activo
            ? this.desactivarProducto.emit(prod.producto)
            : this.activarProducto.emit(prod.producto),
      },
      {
        separator: true,
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500 dark:text-red-400 font-medium',
        command: () => this.borrarProducto.emit(prod.producto),
      },
    ];
  });

  enviarAlCarrito(producto: Producto) {
    this.agregarAlCarrito.emit({
      id_productor: producto.id_productor,
      id_producto: producto.id_producto,
      cantidad: 1,
    });
  }
}
