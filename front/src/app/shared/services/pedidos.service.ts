import { Service } from '@angular/core';
import { BaseService } from './base-service.service';
import { Compra } from '@shared/types/compra';
import { environment } from '@env/environment';
import { EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { firstValueFrom } from 'rxjs';

@Service()
export class PedidosService extends BaseService<Pedido> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores/:productor/pedidos`;
  // private readonly _usuarioStore = inject(UserStore);
  // private readonly _http = inject(HttpClient);
  // private readonly _dialog = inject(DialogService);

  public async cambiarEstado(
    productor: string,
    id_pedido: number,
    estado_pedido: EstadoPedidoType,
  ) {
    const url = `${this.buildUrl({ productor })}/${id_pedido}`;
    await firstValueFrom(this.http.patch(url, { estado_pedido }));
  }
}
