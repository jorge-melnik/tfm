import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Calendar, CreditCard, User, Verified } from '@primeicons/angular';
import { PagoTransferencia } from '@shared/types/pago';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-datos-transferencia-form',
  imports: [
    FloatLabel,
    IconField,
    InputIcon,
    FormsModule,
    CreditCard,
    User,
    Calendar,
    Verified,
    FloatLabel,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './datos-transferencia.form.html',
  styleUrl: './datos-transferencia.form.css',
})
export class DatosTransferenciaForm {
  public datosTransferencia = model.required<PagoTransferencia>();
}
