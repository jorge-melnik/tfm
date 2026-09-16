import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ApiQueryParams } from '@shared/types/api.types';
import { PedidosService } from '@shared/services/pedidos.service';
import { UserStore } from '@shared/services/stores/user.store';
import { httpResource } from '@angular/common/http';
import { Productor } from '@shared/types/user.types';
import { environment } from '@env/environment';
import { ListaPedidosComponent } from '@shared/components/lista-pedidos/lista-pedidos.component';
import { EstadoPedidoType } from '@shared/types/pedido';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { ArrowLeft } from '@primeicons/angular';

@Component({
  selector: 'app-productor',
  imports: [RouterLink, Avatar, ListaPedidosComponent, ArrowLeft],
  templateUrl: './productor.page.html',
  styleUrl: './productor.page.css',
})
export class ProductorPage {
  private _pedidosService = inject(PedidosService);
  public readonly paginationStore = inject(PaginationStore);
  public userStore = inject(UserStore);

  public estado_pedido = signal<EstadoPedidoType | 'TODOS'>('TODOS');

  public productor = input.required<string>();

  private readonly productorResource = httpResource<Productor>(
    () => `${environment.apiUrl}/productores/${this.productor()}`,
  );

  public productorData = computed(() => this.productorResource.value());

  private readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
      const consumidor = this.userStore.user()?.username;
      const estado_pedido = this.estado_pedido();
      if (!productor || !consumidor) return undefined;
      return {
        productor,
        consumidor,
        estado_pedido,
        limit: this.paginationStore.limit(),
        page: this.paginationStore.page(),
        sort: this.paginationStore.sortField(),
        sort_direction: this.paginationStore.sortOrder() === -1 ? 'DESC' : 'ASC',
      };
    },
    loader: async ({ params }) => {
      const { productor, consumidor, estado_pedido, limit, page, sort, sort_direction } = params;

      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      const queryParams: ApiQueryParams = { productor, consumidor }; //Ninguno de los dos puede ser null.
      if (estado_pedido && estado_pedido !== 'TODOS') queryParams['estado_pedido'] = estado_pedido;

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
}
