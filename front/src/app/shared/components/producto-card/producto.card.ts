import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FotoCarrusel } from '../foto-carrusel/foto.carrusel';
import { Producto } from '@shared/types/producto';
import { TooltipModule } from 'primeng/tooltip';
import { ItemCarrito } from '@shared/types/item-carrito';

@Component({
  selector: 'app-producto-card',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, FotoCarrusel, TooltipModule],
  templateUrl: './producto.card.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './producto.card.css',
})
export class ProductoCard {
  producto = input.required<Producto>();
  layout = input<'grid' | 'list'>('grid'); // <-- Recibe el modo del DataView
  cdnUrl = input.required<string>();

  agregarAlCarrito = output<Pick<ItemCarrito, 'id_productor' | 'id_producto' | 'cantidad'>>();

  enviarAlCarrito(producto: Producto) {
    this.agregarAlCarrito.emit({
      id_productor: producto.id_productor,
      id_producto: producto.id_producto,
      cantidad: 1,
    });
  }
}
