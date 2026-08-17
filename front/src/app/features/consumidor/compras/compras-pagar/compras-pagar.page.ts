import { Component, effect, inject, input, resource, signal } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { Tag } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Compra } from '@shared/types/compra';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatosTarjetaForm } from '@shared/components/datos-tarjeta/datos-tarjeta.form';
import { MediosPagoSelector } from '@shared/components/medios-pago/medios-pago.selector';
import {
  MedioPago,
  MEDIOS_PAGO_DISPONIBLES,
  PagoTransferencia,
  TarjetaSimulada,
} from '@shared/types/pago';
import { DatosTransferenciaForm } from '@shared/components/datos-transferencia/datos-transferencia.form';
import { CreditCard, Spinner } from '@primeicons/angular';
import { DialogService } from '@shared/services/dialog.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-compras-pagar',
  imports: [
    Tag,
    CreditCard,
    ButtonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    DatosTarjetaForm,
    DatosTransferenciaForm,
    MediosPagoSelector,
    ProgressSpinner,
  ],
  templateUrl: './compras-pagar.page.html',
  styleUrl: './compras-pagar.page.css',
})
export class ComprasPagarPage {
  public id_compra = input.required<number>();
  public readonly userStore = inject(UserStore);
  private _location = inject(Location);
  private _dialogService = inject(DialogService);
  private readonly _router = inject(Router);

  private readonly _compraService = inject(ComprasService);

  public mediosDePagoDisponibles = signal<MedioPago[]>(MEDIOS_PAGO_DISPONIBLES);
  public metodoDePagoSeleccionado = signal<string>(MEDIOS_PAGO_DISPONIBLES[0].codigo);
  public procesandoPago = signal<boolean>(false);

  public datosTarjeta = signal<TarjetaSimulada>({
    id_compra: 0,
    monto_pagado: '0',
    numero_tarjeta: '',
    titular: '',
    expiracion: '',
    cvv: '',
  });

  public datosTransferencia = signal<PagoTransferencia>({
    id_compra: 0,
    monto_pagado: '0',
    banco: '',
    numero_transaccion: '',
  });

  public compraResource = resource({
    params: () => {
      const username = this.userStore.user()?.username;
      const id_compra = this.id_compra();

      if (!username || !id_compra) return undefined; //Retornar undefined detiene la ejecución del loader.
      return { id_compra, username };
    },
    loader: async ({ params }) => {
      const { id_compra, username } = params;
      console.log({ params });
      return this._compraService.getById(username, id_compra);
    },
  });
  constructor() {
    effect(() => {
      const compra = this.compraResource.value();

      if (compra) {
        if (compra.tiene_pago_pendiente) {
          this._dialogService.addWarn('Esta compra ya tiene un pago pendiente aprobación.');
          this._router.navigate(['consumidor', 'compras']);
        }
        if (compra.estado_compra === 'PAGADO') {
          this._dialogService.addWarn('Esta compra ya tiene un pago confirmado.');
          this._router.navigate(['consumidor', 'compras']);
        }
        this.datosTarjeta.update((actual) => ({
          ...actual,
          id_compra: compra.id_compra,
          monto_pagado: compra.total,
        }));

        this.datosTransferencia.update((actual) => ({
          ...actual,
          id_compra: compra.id_compra,
          monto_pagado: compra.total,
        }));
      }
    });
  }
  async procesarPago(compra: Compra) {
    this.procesandoPago.set(true);
    const metodo = this.metodoDePagoSeleccionado();
    const username = this.userStore.user()?.username;
    const id_compra = this.id_compra();

    if (!username) return;
    try {
      if (metodo === 'transferencia') {
        const datos = this.datosTransferencia();
        await this._compraService.procesarTransferencia(username, id_compra, datos);
      }
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
    this.procesandoPago.set(false);
  }

  volver() {
    this._location.back();
  }
}
