import { Component, computed, inject, input, resource } from '@angular/core';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';
import { ApiQueryParams } from '@shared/types/api.types';
import { PedidosService } from '@shared/services/pedidos.service';
import { UserStore } from '@shared/services/stores/user.store';
import { httpResource } from '@angular/common/http';
import { Productor } from '@shared/types/user.types';
import { environment } from '@env/environment';
import { PedidoCard } from '@shared/components/pedido-card/pedido.card';

@Component({
  selector: 'app-productor',
  imports: [RouterLink, Avatar, PedidoCard],
  templateUrl: './productor.page.html',
  styleUrl: './productor.page.css',
})
export class ProductorPage {
  private _pedidosService = inject(PedidosService);
  private _userStore = inject(UserStore);

  public productor = input.required<string>();

  private readonly productorResource = httpResource<Productor>(
    () => `${environment.apiUrl}/productores/${this._userStore.user()?.username}`,
  );

  public productorData = computed(() => this.productorResource.value());

  private readonly pedidosResource = resource({
    params: () => {
      const productor = this.productor();
      if (!productor) return undefined;
      return { productor };
    },
    loader: async ({ params }) => {
      const { productor } = params;

      const queryParams: ApiQueryParams = { productor };

      console.log({ queryParams });
      return this._pedidosService.getBy({ queryParams, pathParams: { productor } });
    },
  });

  public pedidos = computed(() => {
    const res = this.pedidosResource.value();
    if (!res) return [];
    return res.data;
  });

  public totalPedidos = computed(() => {
    const res = this.pedidosResource.value();
    if (!res) return 0;
    return res.meta.total;
  });

  public isLoading = computed(() => this.pedidosResource.isLoading());
}
