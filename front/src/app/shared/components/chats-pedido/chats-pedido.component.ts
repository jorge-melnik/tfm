import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comments, Send } from '@primeicons/angular';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { WebsocketService } from '@shared/services/websocket.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  imports: [DatePipe, Send, Comments, ButtonModule, InputTextModule, FormsModule],
  selector: 'app-chats-pedido',
  styleUrl: './chats-pedido.component.css',
  templateUrl: './chats-pedido.component.html',
})
export class ChatsPedidoComponent {
  private readonly webSocketService = inject(WebsocketService);

  public id_pedido = input.required<number>();
  public id_compra = input.required<number>();

  public enviando = signal<boolean>(false);

  public userStore = inject(UserStore);

  public comprasService = inject(ComprasService);

  public mensaje = signal<string>('');

  public readonly mensajesResource = resource({
    params: () => {
      const id_pedido = this.id_pedido();
      const id_compra = this.id_compra();
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

  public mensajeEmitido = output<string>();
  public async enviarMensaje(): Promise<void> {
    const mensajeLimpio = this.mensaje().trim();
    const username = this.userStore.user()?.username;
    const id_compra = this.id_compra();
    const id_pedido = this.id_pedido();

    if (!mensajeLimpio || !username || this.enviando()) return;

    try {
      this.enviando.set(true);

      await this.comprasService.addMensaje(username, id_compra, id_pedido, mensajeLimpio);
      this.mensajesResource.reload();
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    } finally {
      this.enviando.set(false);
      this.mensaje.set('');
    }
  }
}
