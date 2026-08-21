import { Component, input, resource, inject, computed, signal } from '@angular/core';
import { PedidosService } from '@shared/services/pedidos.service';
import { ApiQueryParams } from '@shared/types/api.types';
import { DataView } from 'primeng/dataview';
import { VistaPedidoComponent } from '@shared/components/vista-pedido/vista-pedido.component';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { EstadoPedido, EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { PaginationStore } from '@shared/services/stores/pagination.store';

@Component({
  selector: 'app-pedidos',
  imports: [DataView, VistaPedidoComponent, SelectButton, FormsModule],
  templateUrl: './pedidos.page.html',
  styleUrl: './pedidos.page.css',
})
export class PedidosPage {
  public readonly productor = input.required<string>();
  public readonly paginationStore = inject(PaginationStore);
  private readonly _pedidosService = inject(PedidosService);

  public estadoFiltro = signal<EstadoPedidoType | 'TODOS'>('TODOS');

  public opcionesEstado = [
    { label: 'Todos', value: 'TODOS' },
    { label: 'Pagados', value: 'PAGADO' },
    { label: 'Listos', value: 'LISTO PARA ENTREGA' },
    { label: 'Entregados', value: 'ENTREGADO' },
    { label: 'Cancelados', value: 'CANCELADO' },
  ];

  private readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
      if (!productor) return undefined;
      return { productor };
    },
    loader: async ({ params }) => {
      const { productor } = params;
      const queryParams: ApiQueryParams = { productor };
      return this._pedidosService.getBy({ queryParams, pathParams: { productor } });
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

  public async onCambiarEstadoPedido(event: { pedido: Pedido; nuevoEstado: EstadoPedidoType }) {
    //TODO: Cambiar estado pedido
    this.pedidosResource.reload();
  }
}
