import { inject, Service } from '@angular/core';
import { UserStore } from './stores/user.store';
import { HttpClient } from '@angular/common/http';
import { DialogService } from './dialog.service';
import { BaseService } from './base-service.service';
import { Compra } from '@shared/types/compra';
import { environment } from '@env/environment';

@Service()
export class ComprasService extends BaseService<Compra> {
  protected override serviceUrl: string = `${environment.apiUrl}/consumidores/:username/compras`;
  // private readonly _usuarioStore = inject(UserStore);
  // private readonly _http = inject(HttpClient);
  // private readonly _dialog = inject(DialogService);
}
