import { Component, inject, input, resource, signal } from '@angular/core';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { Compra, DatosTarjeta } from '@shared/types/compra';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DatosTarjetaForm } from '@shared/components/datos-tarjeta/datos-tarjeta.form';

@Component({
  selector: 'app-compras-pagar',
  imports: [
    Tag,
    RadioButton,
    ButtonModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    DatosTarjetaForm,
  ],
  templateUrl: './compras-pagar.page.html',
  styleUrl: './compras-pagar.page.css',
})
export class ComprasPagarPage {
  public id_compra = input.required<number>();
  public readonly userStore = inject(UserStore);
  private _location = inject(Location);

  private readonly _compraService = inject(ComprasService);

  public metodosDePago = signal<string[]>(['TRANSFERENCIA', 'TARJETA']);
  public metodoDePagoSeleccionado = signal<string>('TARJETA');
  public procesandoPago = signal<boolean>(false);

  public datosTarjeta = signal<DatosTarjeta>({
    numero: '',
    titular: '',
    vencimiento: '',
    cvv: '',
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

  procesarPago(compra: Compra) {
    this.procesandoPago.set(true);

    const payload = {
      id_compra: compra.id_compra,
      metodo: this.metodoDePagoSeleccionado(),
      ...(this.metodoDePagoSeleccionado() === 'TARJETA' ? { tarjeta: this.datosTarjeta } : {}),
    };

    console.log('Procesando pago:', payload);

    // Simulación de llamada al servicio de pago
    setTimeout(() => {
      this.procesandoPago.set(false);
      // Lógica posterior: Redireccionar, Toast de éxito, etc.
    }, 1500);
  }

  volver() {
    this._location.back();
  }
}
