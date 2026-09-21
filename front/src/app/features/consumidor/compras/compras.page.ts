import { Component, inject, resource, computed, signal, OnInit } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { DialogService } from '@shared/services/dialog.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { UserStore } from '@shared/services/stores/user.store';
import { ApiQueryParams, PathParams } from '@shared/types/api.types';
import { DataView, DataViewPageEvent } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CreditCard, Dollar, InfoCircle } from '@primeicons/angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaginationStore } from '@shared/services/stores/pagination.store';

@Component({
  selector: 'app-compras',
  imports: [DataView, ButtonModule, Tag, CreditCard, InfoCircle, RouterLink, Dollar],
  templateUrl: './compras.page.html',

  styleUrl: './compras.page.css',
})
export class ComprasPage implements OnInit {
  private readonly _comprasService = inject(ComprasService);
  public readonly paginationStore = inject(PaginationStore);
  public readonly userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);

  //FIXME: No está bueno el try catch en el resource
  private readonly _comprasResource = resource({
    params: () => ({
      username: this.userStore.user()?.username,
      limit: this.paginationStore.limit(),
      page: this.paginationStore.page(),
      sort: this.paginationStore.sortField(),
      sort_direction: 'DESC',
    }),
    loader: async ({ params }) => {
      const { limit, page, sort, sort_direction, username } = params;

      console.log({ limit, page, sort, sort_direction });
      if (!username) return { data: [], meta: { total: 0 } };
      const queryParams: ApiQueryParams = {};
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      const pathParams: PathParams = { username };
      console.log({ queryParams, pagination, pathParams });
      try {
        const response = await this._comprasService.getBy({ queryParams, pagination, pathParams });
        return response;
      } catch (error: any) {
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
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

  goToPagar(id_compra: number) {
    this._router.navigate([id_compra, 'pagar'], {
      relativeTo: this._route,
    });
  }

  async ngOnInit(): Promise<void> {
    this.paginationStore.resetPagination();
  }
}
