import { Component, inject, resource, computed, signal } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { DialogService } from '@shared/services/dialog.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { UserStore } from '@shared/services/stores/user.store';
import { ApiQueryParams, PathParams } from '@shared/types/api.types';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CreditCard, InfoCircle } from '@primeicons/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-compras',
  imports: [DataView, ButtonModule, Tag, CreditCard, InfoCircle, RouterLink],
  templateUrl: './compras.page.html',

  styleUrl: './compras.page.css',
})
export class ComprasPage {
  private readonly _comprasService = inject(ComprasService);
  public readonly preferenciasStore = inject(PreferenciasStore);
  public readonly userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  public page = signal<number>(1);

  public first = computed(() => ((this.page() || 1) - 1) * this.preferenciasStore.limit());
  public sortKey = signal<string>('');
  public sortOrder = signal<number>(0);
  public sortField = signal<string>('');

  private readonly _comprasResource = resource({
    params: () => ({
      username: this.userStore.user()?.username,
      limit: this.preferenciasStore.limit(),
      page: this.page(),
      sort: this.sortField(),
      sort_direction: this.sortOrder() === -1 ? 'DESC' : 'ASC',
    }),
    loader: async ({ params }) => {
      const { limit, page, sort, sort_direction, username } = params;
      console.log({ username });
      if (!username) return { data: [], meta: { total: 0 } };
      const queryParams: ApiQueryParams = {};
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      const pathParams: PathParams = { username };
      console.log({ queryParams, pagination, pathParams });
      try {
        const response = await this._comprasService.getBy({ queryParams, pagination, pathParams });
        return response;
      } catch (error: any) {
        this._dialogService.addError(error.message);
        return { data: [], meta: { total: 0 } };
      }
    },
  });

  public compras = computed(() => {
    if (!this._comprasResource.hasValue()) return [];
    return this._comprasResource.value().data;
  });

  public total = computed(() => {
    if (!this._comprasResource.hasValue()) return 0;
    return this._comprasResource.value().meta.total;
  });

  onPageChange(event: any) {
    console.log('onPageChange');
    this.preferenciasStore.setLimit(event.rows);
    const nuevaPagina = event.first / event.rows + 1;
    this.page.set(nuevaPagina);
  }

  goToPagar(id_compra: number) {
    this._router.navigate([id_compra, 'pagar'], {
      relativeTo: this._route,
    });
  }
}
