import { Service } from '@angular/core';
import { BaseService } from './base-service.service';
import { Compra } from '@shared/types/compra';
import { environment } from '@env/environment';
import { EstadoPedidoType, Mensaje, Pedido } from '@shared/types/pedido';
import { firstValueFrom } from 'rxjs';

@Service()
export class PedidosService extends BaseService<Pedido> {
  protected override serviceUrl: string = `${environment.apiUrl}/productores/:productor/pedidos`;

  public async cambiarEstado(
    productor: string,
    id_pedido: number,
    estado_pedido: EstadoPedidoType,
  ) {
    const url = `${this.buildUrl({ productor })}/${id_pedido}`;
    await firstValueFrom(this.http.patch(url, { estado_pedido }));
  }

  public getMensajes(productor: string, id_pedido: number): Promise<Mensaje[]> {
    const url = `${this.buildUrl({ productor })}/${id_pedido}/mensajes`;
    return firstValueFrom(this.http.get<Mensaje[]>(url));
  }

  public async addMensaje(productor: string, id_pedido: number, mensaje: string): Promise<Mensaje> {
    //Estos métodos no diferencian si es un mensaje del productor o del consumidor. Tenemos rutas distintas.
    const url = `${this.buildUrl({ productor })}/${id_pedido}/mensajes`;
    return firstValueFrom(this.http.post<Mensaje>(url, { mensaje }));
  }

  public async removeMensaje(productor: string, id_pedido: number, id_mensaje: number) {
    const url = `${this.buildUrl({ productor })}/${id_pedido}/mensajes/${id_mensaje}`;
    await firstValueFrom(this.http.delete(url));
  }
}
