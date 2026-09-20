import { DatePipe } from '@angular/common';
import { Component, computed, inject, input, output, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Comments, Send } from '@primeicons/angular';

import { UserStore } from '@shared/services/stores/user.store';
import { Mensaje } from '@shared/types/pedido';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  imports: [DatePipe, Send, Comments, ButtonModule, InputTextModule, FormsModule],
  selector: 'app-chats-pedido',
  styleUrl: './chats-pedido.component.css',
  templateUrl: './chats-pedido.component.html',
})
export class ChatsPedidoComponent {
  public mensajes = input.required<Mensaje[]>();

  public userStore = inject(UserStore);

  public mensaje = signal<string>('');

  public mensajeEmitido = output<string>();
  public async enviarMensaje(): Promise<void> {
    const mensajeLimpio = this.mensaje().trim();

    if (!mensajeLimpio) return;

    try {
      this.mensajeEmitido.emit(mensajeLimpio);
      //
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    } finally {
      this.mensaje.set('');
    }
  }
}
