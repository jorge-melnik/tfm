import { inject, Service } from '@angular/core';
import { UserStore } from './stores/user.store';
import { HttpClient } from '@angular/common/http';
import { DialogService } from './dialog.service';
import { BaseService } from './base-service.service';
import { Compra } from '@shared/types/compra';
import { environment } from '@env/environment';
import { firstValueFrom } from 'rxjs';
import { PagoTransferencia } from '@shared/types/pago';

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

  public getById(username: string, id_compra: number): Promise<Compra> {
    const url = `${this.buildUrl({ username })}/${id_compra}`;
    return firstValueFrom(this.http.get<Compra>(url));
  }

  public getPagos() {
    //TODO:
  }

  public procesarTransferencia(username: string, id_compra: number, pago: PagoTransferencia) {
    const url = `${this.buildUrl({ username })}/${id_compra}/pagos`;
    return firstValueFrom(this.http.post(url, pago));
  }
}
