import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { EstadoPedido, EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { FotoCarrusel } from '../foto-carrusel/foto.carrusel';
import { Check, Comments, Send } from '@primeicons/angular';
import { RouterLink } from '@angular/router';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { Badge } from 'primeng/badge';
import { UserStore } from '@shared/services/stores/user.store';

@Component({
  selector: 'app-vista-pedido',
  imports: [
    CurrencyPipe,
    ButtonModule,
    OverlayBadgeModule,
    TagModule,
    FotoCarrusel,
    Check,
    Send,
    Comments,
    Badge,
    RouterLink,
  ],
  templateUrl: './vista-pedido.component.html',
  styleUrl: './vista-pedido.component.css',
})
export class VistaPedidoComponent {
  public userStore = inject(UserStore);

  public pedido = input.required<Pedido>();
  public cambiarEstado = output<{ pedido: Pedido; estado_pedido: EstadoPedidoType }>();
  public id_pedido = input<number>();
  public readonly verMensajes = output<Pedido>();

  public onCambiarEstado(estado_pedido: EstadoPedidoType) {
    this.cambiarEstado.emit({ pedido: this.pedido(), estado_pedido });
  }

  public obtenerSeveridadEstado(
    estado: EstadoPedidoType,
  ): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    // 'PAGANDO' | 'PAGADO' | 'LISTO PARA ENTREGA' | 'ENTREGADO' | 'CANCELADO'
    switch (estado) {
      case EstadoPedido.PAGANDO:
        return 'secondary';
      case EstadoPedido.PAGADO:
        return 'info';
      case EstadoPedido.LISTO:
        return 'warn';
      case EstadoPedido.ENTREGADO:
        return 'success';
      case EstadoPedido.CANCELADO:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  emitirVerMensajes(pedido: Pedido) {
    this.verMensajes.emit(pedido);
  }
}
