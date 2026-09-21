import { DestroyRef, inject, Injectable, signal, Signal } from '@angular/core';
import { environment } from '@env/environment';
import { webSocket } from 'rxjs/webSocket';
import { Mensaje } from '@shared/types/pedido';
import { Compra } from '@shared/types/compra';
import { Pregunta } from '@shared/types/preguntas';

type WsPayload = Compra | Mensaje | Pregunta | Record<string, unknown>;

@Injectable()
export class WebsocketService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly subject = webSocket(environment.wsUrl);

  private readonly _nuevaCompra = signal<Compra | undefined>(undefined);
  private readonly _nuevoMensaje = signal<Mensaje | undefined>(undefined);
  private readonly _nuevaPregunta = signal<Pregunta | undefined>(undefined);

  public readonly nuevaCompra: Signal<Compra | undefined> = this._nuevaCompra.asReadonly();
  public readonly nuevoMensaje: Signal<Mensaje | undefined> = this._nuevoMensaje.asReadonly();
  public readonly nuevaPregunta: Signal<Pregunta | undefined> = this._nuevaPregunta.asReadonly();

  constructor() {
    console.log('CONSTRUCTOR WEBSOCKET');
    const subscripcion = this.subject.subscribe({
      next: (data: any) => this.despacharMensaje(data),
      error: (err) => console.error('Error en el WebSocket:', err),
    });

    this.destroyRef.onDestroy(() => {
      subscripcion.unsubscribe();
      this.subject.complete();
    });
  }

  private despacharMensaje(data: WsPayload): void {
    if ('id_compra' in data && data.id_compra) {
      this._nuevaCompra.set(data as Compra);
    }
    if ('id_mensaje' in data && data.id_mensaje) {
      this._nuevoMensaje.set(data as Mensaje);
    }
    if ('id_pregunta' in data && data.id_pregunta) {
      this._nuevaPregunta.set(data as Pregunta);
    }
  }
}
