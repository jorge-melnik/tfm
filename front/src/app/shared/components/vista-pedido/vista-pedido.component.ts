import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { EstadoPedido, EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { FotoCarrusel } from '../foto-carrusel/foto.carrusel';
import { Check, Send } from '@primeicons/angular';

@Component({
  selector: 'app-vista-pedido',
  imports: [CurrencyPipe, ButtonModule, TagModule, FotoCarrusel, Check, Send],
  templateUrl: './vista-pedido.component.html',
  styleUrl: './vista-pedido.component.css',
})
export class VistaPedidoComponent {
  public pedido = input.required<Pedido>();
  public cambiarEstado = output<{ pedido: Pedido; estado_pedido: EstadoPedidoType }>();

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
}
