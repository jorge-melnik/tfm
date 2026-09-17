import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comments, Send } from '@primeicons/angular';
import { PedidosService } from '@shared/services/pedidos.service';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { UserStore } from '@shared/services/stores/user.store';
import { ApiQueryParams } from '@shared/types/api.types';
import { Pedido } from '@shared/types/pedido';
import { Badge } from 'primeng/badge';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-chats',
  imports: [Badge, Tag, DatePipe, CurrencyPipe, Tooltip, Send, FormsModule],
  templateUrl: './chats.page.html',
  styleUrl: './chats.page.css',
})
export class ChatsPage {
  public readonly userStore = inject(UserStore);
  public readonly paginationStore = inject(PaginationStore);

  private _pedidosService = inject(PedidosService);
  public productor = input.required<string>();

  public pedidoSeleccionado = signal<Pedido | null>(null);

  public chatInput = signal<string>('');

  public readonly sidebarVisible = signal<boolean>(true);

  public toggleSidebar(): void {
    this.sidebarVisible.update((v) => !v);
  }

  public readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
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
      if (!ped || !username) return undefined;
      return { id_pedido: ped.id_pedido, username };
    },
    loader: async ({ params }) => {
      const { username, id_pedido } = params;
      return this._pedidosService.getMensajes(username, id_pedido);
    },
  });

  // 2. Método para seleccionar pedido
  public seleccionarPedido(pedido: Pedido): void {
    this.pedidoSeleccionado.set(pedido);
  }

  public async enviarMensaje(): Promise<void> {
    const texto: string = this.chatInput();
    const ped = this.pedidoSeleccionado();
    const username = this.userStore.user()?.username;
    const mensajeLimpio = texto.trim();
    this.chatInput.set('');
    if (!ped || !username || !mensajeLimpio) return;

    await this._pedidosService.addMensaje(username, ped.id_pedido, mensajeLimpio);

    this.mensajesResource.reload();
    this.pedidosResource.reload();
  }
}
