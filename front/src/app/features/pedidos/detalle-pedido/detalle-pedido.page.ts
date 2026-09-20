import { Component, computed, effect, inject, input, resource, signal } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { VistaPedidoComponent } from '@shared/components/vista-pedido/vista-pedido.component';
import { ButtonModule } from 'primeng/button';
import { WebsocketService } from '@shared/services/websocket.service';
import { ChatsPedidoComponent } from '@shared/components/chats-pedido/chats-pedido.component';
import { DialogService } from '@shared/services/dialog.service';
import { PedidosService } from '@shared/services/pedidos.service';
import { EstadoPedidoType, Pedido } from '@shared/types/pedido';

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

  private readonly ultimoPedidoValido = signal<Pedido | null>(null);

  public readonly pedidoResource = resource({
    params: () => {
      const id_pedido = this.id_pedido();
      const id_compra = this.id_compra();
      const username = this.userStore.user()?.username;
      const esConsumidor = this.userStore.esConsumidor();
      const esProductor = this.userStore.esProductor();
      if (esConsumidor && !id_compra) return undefined;
      if (!id_pedido || !username) return undefined;
      const ultimaCompra = this.webSocketService.nuevaCompra();
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

  public pedido = computed(() => this.pedidoResource.value() ?? this.ultimoPedidoValido());

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

  constructor() {
    //FIXME: Esto es horrible.
    effect(() => {
      const val = this.pedidoResource.value();
      if (val) {
        this.ultimoPedidoValido.set(val);
      }
    });
  }

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

  public async onCambiarEstadoPedido(event: { pedido: Pedido; estado_pedido: EstadoPedidoType }) {
    console.log('onCambiarEstadoPedido');
    const productor = this.userStore.user()?.username;
    if (!productor) return;

    const { pedido, estado_pedido } = event;
    if (productor !== pedido.productor) return;
    await this._pedidosService.cambiarEstado(productor, pedido.id_pedido, estado_pedido);
    // this.pedidoResource.reload();
  }
}
