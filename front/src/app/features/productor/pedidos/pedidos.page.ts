import { Component, input, resource, inject, computed, signal } from '@angular/core';
import { PedidosService } from '@shared/services/pedidos.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { EstadoPedido, EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { FormsModule } from '@angular/forms';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { ListaPedidosComponent } from '@shared/components/lista-pedidos/lista-pedidos.component';

@Component({
  selector: 'app-pedidos',
  imports: [FormsModule, ListaPedidosComponent],
  templateUrl: './pedidos.page.html',
  styleUrl: './pedidos.page.css',
})
export class PedidosPage {
  public readonly username = input.required<string>();
  public readonly paginationStore = inject(PaginationStore);
  private readonly _pedidosService = inject(PedidosService);

  public estado_pedido = signal<EstadoPedidoType | 'TODOS'>('TODOS');

  public opcionesEstado = signal(
    Object.entries(EstadoPedido).map(([label, value]) => ({
      label,
      value,
    })),
  );

  private readonly pedidosResource = resource({
    params: () => {
      const productor = this.username();
      const estado_pedido = this.estado_pedido();
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
      console.log({ estado_pedido });
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

  public onFiltroChange() {
    this.paginationStore.setPage(0);
  }

  public async onCambiarEstadoPedido(event: { pedido: Pedido; estado_pedido: EstadoPedidoType }) {
    const productor = this.username();
    if (!productor) return;

    const { pedido, estado_pedido } = event;
    if (productor !== pedido.productor) return;
    await this._pedidosService.cambiarEstado(productor, pedido.id_pedido, estado_pedido);
    this.pedidosResource.reload();
  }
}
