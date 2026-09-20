import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Bars, Comments, Send, ShoppingBag } from '@primeicons/angular';
import { ChatsPedidoComponent } from '@shared/components/chats-pedido/chats-pedido.component';
import { PedidosService } from '@shared/services/pedidos.service';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { UserStore } from '@shared/services/stores/user.store';
import { WebsocketService } from '@shared/services/websocket.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { Pedido } from '@shared/types/pedido';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-chats',
  imports: [
    Badge,
    Tag,
    CurrencyPipe,
    Tooltip,
    FormsModule,
    ChatsPedidoComponent,
    Comments,
    ShoppingBag,
    Bars,
  ],
  templateUrl: './chats.page.html',
  styleUrl: './chats.page.css',
  providers: [WebsocketService],
})
export class ChatsPage {
  public readonly userStore = inject(UserStore);
  public readonly paginationStore = inject(PaginationStore);
  private readonly _webSocketService = inject(WebsocketService);

  private _pedidosService = inject(PedidosService);
  public productor = input.required<string>();

  public pedidoSeleccionado = signal<Pedido | null>(null);

  public readonly sidebarVisible = signal<boolean>(true);

  public toggleSidebar(): void {
    this.sidebarVisible.update((v) => !v);
  }

  public readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
      const ultimaCompra = this._webSocketService.nuevaCompra();
      const ultimoMensaje = this._webSocketService.nuevoMensaje();
      if (!productor) return undefined;

      return {
        productor,
        limit: this.paginationStore.limit(),
        page: this.paginationStore.page(),
        sort: this.paginationStore.sortField(),
        sort_direction: this.paginationStore.sort_direction(),
      };
    },
    loader: async ({ params }) => {
      const { productor, limit, page, sort, sort_direction } = params;
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      const queryParams: ApiQueryParams = { productor, hay_no_leidos_productor: true };
      return this._pedidosService.getBy({ queryParams, pathParams: { productor }, pagination });
    },
  });

  public readonly mensajesResource = resource({
    params: () => {
      const ped = this.pedidoSeleccionado();
      const username = this.userStore.user()?.username;

      const ultimoMensaje = this._webSocketService.nuevoMensaje();
      console.log({ ultimoMensaje });
      if (!ped || !username) return undefined;
      return { id_pedido: ped.id_pedido, username };
    },
    loader: async ({ params }) => {
      const { username, id_pedido } = params;
      return this._pedidosService.getMensajes(username, id_pedido);
    },
  });

  public seleccionarPedido(pedido: Pedido): void {
    this.pedidoSeleccionado.set(pedido);
  }

  public async enviarMensaje(texto: string): Promise<void> {
    const ped = this.pedidoSeleccionado();
    const username = this.userStore.user()?.username;
    const mensajeLimpio = texto.trim();
    if (!ped || !username || !mensajeLimpio) return;

    await this._pedidosService.addMensaje(username, ped.id_pedido, mensajeLimpio);

    this.mensajesResource.reload();
    this.pedidosResource.reload();
  }
}
