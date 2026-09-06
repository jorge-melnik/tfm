import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ComprasService } from '@shared/services/compras.service';
import { PedidosService } from '@shared/services/pedidos.service';
import { UserStore } from '@shared/services/stores/user.store';
import { Pedido } from '@shared/types/pedido';
import { VistaPedidoComponent } from '@shared/components/vista-pedido/vista-pedido.component';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Send } from '@primeicons/angular';

@Component({
  selector: 'app-detalle-pedido',
  imports: [VistaPedidoComponent, DatePipe, ButtonModule, Send],
  templateUrl: './detalle-pedido.page.html',
  styleUrl: './detalle-pedido.page.css',
})
export class DetallePedidoPage {
  public comprasService = inject(ComprasService);
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

  public readonly mensajesResource = resource({
    params: () => {
      const id_pedido = this.id_pedido();
      const id_compra = this.id_compra();
      const username = this.userStore.user()?.username;
      if (!id_pedido || !id_compra || !username) return undefined;
      return { id_pedido, id_compra, username };
    },
    loader: async ({ params }) => {
      const { id_pedido, id_compra, username } = params;
      return this.comprasService.getMensajes(username, id_compra, id_pedido);
    },
  });

  public mensajes = computed(() => this.mensajesResource.value() || []); //FIXME: no está del todo paginado ni ordenado en la api

  public async enviarMensaje(texto: string): Promise<void> {
    const mensajeLimpio = texto.trim();
    const username = this.userStore.user()?.username;
    const id_compra = this.id_compra();
    const id_pedido = this.id_pedido();

    if (!mensajeLimpio || !username || this.enviando()) return;

    try {
      this.enviando.set(true);

      // 1. Llamar al servicio para registrar el mensaje en backend
      await this.comprasService.addMensaje(username, id_compra, id_pedido, mensajeLimpio);

      // 2. Recargar el recurso reactivo de mensajes
      this.mensajesResource.reload();
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    } finally {
      this.enviando.set(false);
    }
  }
}
