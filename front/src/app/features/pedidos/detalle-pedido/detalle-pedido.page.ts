import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { VistaPedidoComponent } from '@shared/components/vista-pedido/vista-pedido.component';
import { ButtonModule } from 'primeng/button';
import { WebsocketService } from '@shared/services/websocket.service';
import { ChatsPedidoComponent } from '@shared/components/chats-pedido/chats-pedido.component';
import { DialogService } from '@shared/services/dialog.service';
import { PedidosService } from '@shared/services/pedidos.service';

@Component({
  selector: 'app-detalle-pedido',
  imports: [VistaPedidoComponent, ButtonModule, ChatsPedidoComponent],
  templateUrl: './detalle-pedido.page.html',
  styleUrl: './detalle-pedido.page.css',
  providers: [WebsocketService],
})
export class DetallePedidoPage {
  private readonly comprasService = inject(ComprasService);
  private readonly _pedidosService = inject(PedidosService);
  private readonly webSocketService = inject(WebsocketService);
  private readonly _dialogService = inject(DialogService);
  public userStore = inject(UserStore);

  public id_compra = input.required<number>();
  public id_pedido = input.required<number>();

  public enviando = signal<boolean>(false);

  public readonly pedidoResource = resource({
    params: () => {
      const id_pedido = this.id_pedido();
      const id_compra = this.id_compra();
      const username = this.userStore.user()?.username;
      const esConsumidor = this.userStore.esConsumidor();
      const esProductor = this.userStore.esProductor();
      if (esConsumidor && !id_compra) return undefined;
      if (!id_pedido || !username) return undefined;
      const ultimoMensaje = this.webSocketService.nuevoMensaje();
      return { id_pedido, id_compra, username, esProductor, esConsumidor };
    },
    loader: async ({ params }) => {
      const { id_pedido, id_compra, username, esProductor, esConsumidor } = params;

      if (esConsumidor && id_compra)
        return this.comprasService.getPedido(username, id_compra, id_pedido);

      if (esProductor) return this._pedidosService.getById(id_pedido, { productor: username });
      return null;
    },
  });

  public pedido = computed(() => this.pedidoResource.value() || undefined);

  public readonly mensajesResource = resource({
    params: () => {
      const id_pedido = this.pedido()?.id_pedido;
      const id_compra = this.pedido()?.id_compra;
      const username = this.userStore.user()?.username;
      const ultimoMensaje = this.webSocketService.nuevoMensaje();
      const esConsumidor = this.userStore.esConsumidor();
      const esProductor = this.userStore.esProductor();
      if (!id_pedido || !username) return undefined;
      console.log('NO AL UNDEFINED');
      return { id_pedido, id_compra, username, esProductor, esConsumidor };
    },
    loader: async ({ params }) => {
      const { id_pedido, id_compra, username, esProductor, esConsumidor } = params;

      if (esConsumidor && id_compra)
        return this.comprasService.getMensajes(username, id_compra, id_pedido);

      if (esProductor) return this._pedidosService.getMensajes(username, id_pedido);

      return [];
    },
  });

  public mensajes = computed(() => this.mensajesResource.value() || []); //FIXME: no está del todo paginado ni ordenado en la api

  public async onMensajeEmitido(mensaje: string) {
    const user = this.userStore.user();
    const id_compra = this.id_compra();
    const id_pedido = this.id_pedido();
    if (!user) return;
    try {
      if (this.userStore.esConsumidor())
        await this.comprasService.addMensaje(user.username, id_compra, id_pedido, mensaje);

      if (this.userStore.esProductor())
        await this._pedidosService.addMensaje(user.username, this.id_pedido(), mensaje);
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }
}
