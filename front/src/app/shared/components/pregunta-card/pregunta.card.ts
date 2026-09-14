import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { Pregunta, RespuestaPost } from '@shared/types/preguntas';
import { Reply, Send } from '@primeicons/angular';
import { UserStore } from '@shared/services/stores/user.store';

@Component({
  selector: 'app-pregunta-card',
  imports: [CommonModule, FormsModule, TextareaModule, ButtonModule, AvatarModule, Reply, Send],
  templateUrl: './pregunta.card.html',
  styleUrl: './pregunta.card.css',
})
export class PreguntaCard {
  public userStore = inject(UserStore);
  public pregunta = input.required<Pregunta>();
  public esPropietario = computed<boolean>(() => {
    const pregunta = this.pregunta();
    const user = this.userStore.user();
    return user?.id_usuario === pregunta?.id_productor;
  }); //si es el productor del producto que tiene la pregunta

  public responder = output<RespuestaPost>();

  public mostrarFormulario = signal<boolean>(false);
  public textoRespuesta = signal<string>('');

  public emitirResponder(): void {
    const texto = this.textoRespuesta().trim();
    if (!texto) return;

    this.responder.emit({
      id_producto: this.pregunta().id_producto,
      id_pregunta: this.pregunta().id_pregunta,
      producto: this.pregunta().producto,
      contenido: texto,
    });
    this.cancelarResponder();
  }

  public cancelarResponder() {
    this.textoRespuesta.set('');
    this.mostrarFormulario.set(false);
  }
}
