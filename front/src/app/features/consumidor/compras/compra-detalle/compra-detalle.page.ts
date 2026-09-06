import { Component, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { resource } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import {
  CreditCard,
  ShoppingCart,
  Box,
  MapMarker,
  InfoCircle,
  ExclamationCircle,
} from '@primeicons/angular';

import { UserStore } from '@shared/services/stores/user.store';
import { ComprasService } from '@shared/services/compras.service';
import { environment } from '@env/environment';
import { VistaPedidoComponent } from '@shared/components/vista-pedido/vista-pedido.component';
import { Pedido } from '@shared/types/pedido';
@Component({
  selector: 'app-compra-detalle',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    ButtonModule,
    TagModule,
    CreditCard,
    MapMarker,
    InfoCircle,
    ExclamationCircle,
    VistaPedidoComponent,
  ],
  templateUrl: './compra-detalle.page.html',
  styleUrl: './compra-detalle.page.css',
})
export class CompraDetallePage {
  private _compraService = inject(ComprasService);
  private _userStore = inject(UserStore);
  private _router = inject(Router);

  public cdnUrl = environment.cdnUrl;

  public id_compra = input.required<number>();

  public compraResource = resource({
    params: () => {
      const username = this._userStore.user()?.username;
      const id_compra = this.id_compra();
      if (!username || !id_compra) return undefined;
      return { id_compra, username };
    },
    loader: async ({ params }) => {
      const { id_compra, username } = params;
      return this._compraService.getById(id_compra, { username });
    },
  });

  public pedidosResource = resource({
    params: () => {
      const username = this._userStore.user()?.username;
      const id_compra = this.id_compra();
      if (!username || !id_compra) return undefined;
      return { id_compra, username };
    },
    loader: async ({ params }) => {
      return this._compraService.getPedidos(params.username, params.id_compra);
    },
  });

  public irAPagar(compra: any) {
    this._router.navigate(['/pagar', compra.id_compra]);
  }

  //TODO: Mover este método a algún servicio o función global o environment
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

  public onVerMensajes(pedido: Pedido) {
    this._router.navigate([
      '/',
      'consumidor',
      'compras',
      pedido.id_compra,
      'pedidos',
      pedido.id_pedido,
    ]);
  }
}
