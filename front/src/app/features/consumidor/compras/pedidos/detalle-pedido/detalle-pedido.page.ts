import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { VistaPedidoComponent } from '@shared/components/vista-pedido/vista-pedido.component';
import { ButtonModule } from 'primeng/button';
import { WebsocketService } from '@shared/services/websocket.service';
import { ChatsPedidoComponent } from '@shared/components/chats-pedido/chats-pedido.component';

@Component({
  selector: 'app-detalle-pedido',
  imports: [VistaPedidoComponent, ButtonModule, ChatsPedidoComponent],
  templateUrl: './detalle-pedido.page.html',
  styleUrl: './detalle-pedido.page.css',
  providers: [WebsocketService],
})
export class DetallePedidoPage {
  private readonly comprasService = inject(ComprasService);
  private readonly webSocketService = inject(WebsocketService);
  public userStore = inject(UserStore);

  public id_compra = input.required<number>();
  public id_pedido = input.required<number>();

  public enviando = signal<boolean>(false);

  public readonly pedidoResource = resource({
    params: () => {
      const id_pedido = this.id_pedido();
      const id_compra = this.id_compra();
      const username = this.userStore.user()?.username;
      if (!id_pedido || !id_compra || !username) return undefined;
      return { id_pedido, id_compra, username };
    },
    loader: async ({ params }) => {
      const { id_pedido, id_compra, username } = params;
      return this.comprasService.getPedido(username, id_compra, id_pedido);
    },
  });

  public pedido = computed(() => this.pedidoResource.value() || undefined);

  public readonly mensajesResource = resource({
    params: () => {
      const id_pedido = this.pedido()?.id_pedido;
      const id_compra = this.pedido()?.id_compra;
      const username = this.userStore.user()?.username;
      const ultimoMensaje = this.webSocketService.nuevoMensaje();
      if (!id_pedido || !id_compra || !username) return undefined;
      return { id_pedido, id_compra, username };
    },
    loader: async ({ params }) => {
      const { id_pedido, id_compra, username } = params;
      return this.comprasService.getMensajes(username, id_compra, id_pedido);
    },
  });

  public mensajes = computed(() => this.mensajesResource.value() || []); //FIXME: no está del todo paginado ni ordenado en la api

  public async onMensajeEmitido(mensaje: string) {
    const user = this.userStore.user();
    const id_compra = this.id_compra();
    const id_pedido = this.id_pedido();
    if (!user) return;
    await this.comprasService.addMensaje(user.username, id_compra, id_pedido, mensaje);
  }
}
