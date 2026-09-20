import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  resource,
  input,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { PedidosService } from '@shared/services/pedidos.service';
import { PreguntasService } from '@shared/services/preguntas-service';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { WebsocketService } from '@shared/services/websocket.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { EstadoPedidoType } from '@shared/types/pedido';

@Component({
  selector: 'app-home-productor',
  imports: [RouterLink],
  templateUrl: './home.page.html',
  providers: [WebsocketService],
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _authService = inject(AuthService);
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
  public totalPedidosPendientes = computed(() => this.pedidosResource.value()?.meta.total || 0);

  public estadosPedidos = signal<EstadoPedidoType[]>(['PAGADO']);

  private readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
      const estadosPedidos = this.estadosPedidos();
      const ultimaCompra = this._webSocketService.nuevaCompra();
      if (!productor) return undefined;
      return {
        productor,
        estadosPedidos,
      };
    },
    loader: async ({ params }) => {
      const { productor, estadosPedidos } = params;

      const pagination: ApiQueryParams = { limit: 1, page: 1 };
      const queryParams: ApiQueryParams = { productor };
      if (estadosPedidos.length > 0) queryParams['estado_pedido'] = estadosPedidos;
      console.log({ queryParams });
      return this._pedidosService.getBy({ queryParams, pathParams: { productor }, pagination });
    },
  });

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

  async ngOnInit() {}
}
