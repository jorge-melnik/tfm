import { Service } from '@angular/core';
import { BaseService } from './base-service.service';
import { Compra } from '@shared/types/compra';
import { environment } from '@env/environment';
import { firstValueFrom } from 'rxjs';
import { PagoTransferencia } from '@shared/types/pago';
import { Mensaje, Pedido } from '@shared/types/pedido';
import { PaginatedResponse } from '@shared/types/api.types';

@Service()
export class ComprasService extends BaseService<Compra> {
  protected override serviceUrl: string = `${environment.apiUrl}/consumidores/:username/compras`;
  // private readonly _usuarioStore = inject(UserStore);
  // private readonly _http = inject(HttpClient);
  // private readonly _dialog = inject(DialogService);

  public getMetodosPagoHabilitados(username: string, id_compra: number) {
    //TODO:
    // const url = this.http.get();
  }

  // public getById(username: string, id_compra: number): Promise<Compra> {
  //   const url = `${this.buildUrl({ username })}/${id_compra}`;
  //   return firstValueFrom(this.http.get<Compra>(url));
  // }

  public getPagos() {
    //TODO:
  }

  public getPedidos(username: string, id_compra: number): Promise<PaginatedResponse<Pedido>> {
    const url = `${this.buildUrl({ username })}/${id_compra}/pedidos`;
    return firstValueFrom(this.http.get<PaginatedResponse<Pedido>>(url));
  }

  public getPedido(username: string, id_compra: number, id_pedido: number): Promise<Pedido> {
    const url = `${this.buildUrl({ username })}/${id_compra}/pedidos/${id_pedido}`;
    return firstValueFrom(this.http.get<Pedido>(url));
  }

  public getMensajes(username: string, id_compra: number, id_pedido: number): Promise<Mensaje[]> {
    const url = `${this.buildUrl({ username })}/${id_compra}/pedidos/${id_pedido}/mensajes`;
    return firstValueFrom(this.http.get<Mensaje[]>(url));
  }

  public async addMensaje(
    username: string,
    id_compra: number,
    id_pedido: number,
    mensaje: string,
  ): Promise<Mensaje> {
    const url = `${this.buildUrl({ username })}/${id_compra}/pedidos/${id_pedido}/mensajes`;
    return firstValueFrom(this.http.post<Mensaje>(url, { mensaje }));
  }

  public async removeMensaje(
    username: string,
    id_compra: number,
    id_pedido: number,
    id_mensaje: number,
  ) {
    const url = `${this.buildUrl({ username })}/${id_compra}/pedidos/${id_pedido}/mensajes/${id_mensaje}`;
    await firstValueFrom(this.http.delete(url));
  }

  public procesarTransferencia(username: string, id_compra: number, pago: PagoTransferencia) {
    const url = `${this.buildUrl({ username })}/${id_compra}/pagos/transferencia`;
    return firstValueFrom(this.http.post(url, pago));
  }
}
