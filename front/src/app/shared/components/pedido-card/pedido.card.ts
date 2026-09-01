import { Component, input } from '@angular/core';
import { FotoCarrusel } from '../foto-carrusel/foto.carrusel';
import { RouterLink } from '@angular/router';
import { Pedido } from '@shared/types/pedido';
import { Tag } from 'primeng/tag';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pedido-card',
  imports: [FotoCarrusel, RouterLink, Tag, CurrencyPipe],
  templateUrl: './pedido.card.html',
  styleUrl: './pedido.card.css',
})
export class PedidoCard {
  public pedido = input.required<Pedido>();

  public obtenerSeveridadEstado(
    estado: string,
  ): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    switch (estado) {
      case 'PAGADO':
      case 'ENTREGADO':
        return 'success';
      case 'PENDIENTE_PAGO':
        return 'warn';
      case 'CANCELADO':
        return 'danger';
      default:
        return 'info';
    }
  }
}
