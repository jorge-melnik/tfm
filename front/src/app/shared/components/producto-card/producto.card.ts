import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FotoCarrusel } from '../foto-carrusel/foto.carrusel';
import { Producto } from '@shared/types/producto';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-producto-card',
  imports: [CommonModule, CardModule, ButtonModule, TagModule, FotoCarrusel, TooltipModule],
  templateUrl: './producto.card.html',
  styleUrl: './producto.card.css',
})
export class ProductoCard {
  producto = input.required<Producto>();
  layout = input<'grid' | 'list'>('grid'); // <-- Recibe el modo del DataView
  cdnUrl = input.required<string>();

  agregarAlCarrito = output<Producto>();
}
