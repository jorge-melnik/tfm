import { Component, input } from '@angular/core';
import { ItemCarrito } from '@shared/types/item-carrito';
import { Card } from 'primeng/card';
import { FotoCarrusel } from '@shared/components/foto-carrusel/foto.carrusel';
import { Tag } from 'primeng/tag';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-item-carrito',
  imports: [Card, FotoCarrusel, Tag, CurrencyPipe],
  templateUrl: './item-carrito.component.html',
  styleUrl: './item-carrito.component.css',
})
export class ItemCarritoComponent {
  public item = input.required<ItemCarrito>();
  public cdnUrl = input.required<string>();
}
