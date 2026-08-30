import { Component, input, output, inject, computed } from '@angular/core';
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
import { Ban, CartPlus, EllipsisV, ShoppingCart } from '@primeicons/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-producto-card',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    FotoCarrusel,
    TooltipModule,
    Menu,
    EllipsisV,
    RouterLink,
    CartPlus,
    ShoppingCart,
    Ban,
  ],
  templateUrl: './producto.card.html',
  styleUrl: './producto.card.css',
})
export class ProductoCard {
  public userStore = inject(UserStore);

  producto = input.required<Producto>();
  layout = input<'grid' | 'list'>('grid'); // <-- Recibe el modo del DataView
  cdnUrl = input.required<string>();

  agregarAlCarrito = output<Pick<ItemCarrito, 'id_productor' | 'id_producto' | 'cantidad'>>();
  verProducto = output<Producto>();
  editarProducto = output<Producto>();
  borrarProducto = output<Producto>();
  desactivarProducto = output<Producto>();
  activarProducto = output<Producto>();

  itemsProductor = computed<MenuItem[]>(() => {
    const prod = this.producto();
    return [
      {
        label: 'Ver detalle',
        icon: 'pi pi-eye',
        command: () => this.verProducto.emit(prod),
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editarProducto.emit(prod),
      },
      {
        label: prod.activo ? 'Desactivar' : 'Activar',
        icon: prod.activo ? 'pi pi-ban' : 'pi pi-check-circle',
        command: () =>
          prod.activo ? this.desactivarProducto.emit(prod) : this.activarProducto.emit(prod),
      },
      {
        separator: true,
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500 dark:text-red-400 font-medium',
        command: () => this.borrarProducto.emit(prod),
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
