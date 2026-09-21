import { Component, input, resource, inject, computed, signal, OnInit } from '@angular/core';
import { PedidosService } from '@shared/services/pedidos.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { EstadoPedido, EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { FormsModule } from '@angular/forms';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { ListaPedidosComponent } from '@shared/components/lista-pedidos/lista-pedidos.component';
import { WebsocketService } from '@shared/services/websocket.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  imports: [FormsModule, ListaPedidosComponent],
  templateUrl: './pedidos.page.html',
  styleUrl: './pedidos.page.css',
  providers: [WebsocketService],
})
export class PedidosPage implements OnInit {
  public readonly productor = input.required<string>();
  public readonly paginationStore = inject(PaginationStore);
  private readonly _pedidosService = inject(PedidosService);
  private readonly _webSocketService = inject(WebsocketService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public estado_pedido = input<EstadoPedidoType | undefined>();
  public estado_pedidoSeleccionado = signal<EstadoPedidoType | 'TODOS'>('TODOS');

  public opcionesEstado = signal(
    Object.entries(EstadoPedido).map(([label, value]) => ({
      label,
      value,
    })),
  );

  private readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
      const estado_pedido = this.estado_pedidoSeleccionado();
      const nuevaCompra = this._webSocketService.nuevaCompra();
      const nuevoMensaje = this._webSocketService.nuevoMensaje();
      if (!productor) return undefined;
      return {
        productor,
        estado_pedido,
        limit: this.paginationStore.limit(),
        page: this.paginationStore.page(),
        sort: this.paginationStore.sortField(),
        sort_direction: this.paginationStore.sortOrder() === -1 ? 'DESC' : 'ASC',
      };
    },
    loader: async ({ params }) => {
      const { productor, estado_pedido, limit, page, sort, sort_direction } = params;

      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      const queryParams: ApiQueryParams = { productor };

      if (estado_pedido && estado_pedido !== 'TODOS') queryParams['estado_pedido'] = estado_pedido;
      console.log({ queryParams });
      return this._pedidosService.getBy({ queryParams, pathParams: { productor }, pagination });
    },
  });

  public pedidos = computed(() => {
    const res = this.pedidosResource.value();
    if (!res) return [];
    return res.data;
  });

  public total = computed(() => {
    const res = this.pedidosResource.value();
    if (!res) return 0;
    return res.meta.total;
  });

  public isLoading = computed(() => this.pedidosResource.isLoading());

  async ngOnInit(): Promise<void> {
    const estadoInicial = this.estado_pedido();
    if (!estadoInicial) return;
    this.estado_pedidoSeleccionado.set(estadoInicial);
    this.router.navigate([]);
  }

  public onFiltroChange() {
    this.paginationStore.setPage(0);
  }

  public async onCambiarEstadoPedido(event: { pedido: Pedido; estado_pedido: EstadoPedidoType }) {
    console.log('onCambiarEstadoPedido');
    const productor = this.productor();
    if (!productor) return;

    const { pedido, estado_pedido } = event;
    if (productor !== pedido.productor) return;
    await this._pedidosService.cambiarEstado(productor, pedido.id_pedido, estado_pedido);
    this.pedidosResource.reload();
  }
}
