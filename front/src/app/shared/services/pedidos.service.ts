import { Service } from '@angular/core';
import { BaseService } from './base-service.service';
import { Compra } from '@shared/types/compra';
import { environment } from '@env/environment';
import { Pedido } from '@shared/types/pedido';

@Service()
export class PedidosService extends BaseService<Pedido> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores/:productor/pedidos`;
  // private readonly _usuarioStore = inject(UserStore);
  // private readonly _http = inject(HttpClient);
  // private readonly _dialog = inject(DialogService);
}
