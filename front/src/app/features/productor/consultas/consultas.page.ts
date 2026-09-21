import { Component, computed, inject, input, OnInit, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { PedidosService } from '@shared/services/pedidos.service';
import { PreguntasService } from '@shared/services/preguntas-service';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { WebsocketService } from '@shared/services/websocket.service';
import { ApiQueryParams } from '@shared/types/api.types';

@Component({
  selector: 'app-consultas',
  imports: [RouterLink],
  templateUrl: './consultas.page.html',
  styleUrl: './consultas.page.css',
  providers: [WebsocketService],
})
export class ConsultasPage implements OnInit {
  private readonly _pedidosService = inject(PedidosService);
  private readonly _preguntasService = inject(PreguntasService);
  public readonly productor = input.required<string>();
  public readonly paginationStore = inject(PaginationStore);
  private readonly _webSocketService = inject(WebsocketService);

  public totalPreguntasPendientes = computed(() => this.preguntasResource.value()?.meta.total || 0);
  public totalMensajesPendientes = computed(
    () => this.pedidosConChatResource.value()?.meta.total || 0,
  );
  public totalStockCritico = signal<number>(0);

  public readonly pedidosConChatResource = resource({
    params: () => {
      const productor = this.productor();
      const ultimoMensaje = this._webSocketService.nuevoMensaje();
      if (!productor) return undefined;
      return {
        productor,
      };
    },
    loader: async ({ params }) => {
      const { productor } = params;

      const pagination: ApiQueryParams = { limit: 1, page: 1 };
      const queryParams: ApiQueryParams = { productor, hay_no_leidos_productor: true };
      return this._pedidosService.getBy({ queryParams, pathParams: { productor }, pagination });
    },
  });

  private preguntasResource = resource({
    params: () => {
      const productor = this.productor();

      const ultimaPregunta = this._webSocketService.nuevaPregunta();
      if (!productor) return undefined;

      return {
        productor,
      };
    },
    loader: async ({ params }) => {
      const { productor } = params;
      const pagination: ApiQueryParams = { limit: 1, page: 1 };
      return this._preguntasService.getPreguntasPendientesProductor(productor, pagination);
    },
  });

  ngOnInit(): void {
    this.paginationStore.resetPagination();
  }
}
