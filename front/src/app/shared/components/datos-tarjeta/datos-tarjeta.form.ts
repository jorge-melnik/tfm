import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { CreditCard, User, Calendar, Verified } from '@primeicons/angular';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { TarjetaSimulada } from '@shared/types/pago';

@Component({
  selector: 'app-datos-tarjeta-form',
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
    InputMaskModule,
  ],
  templateUrl: './datos-tarjeta.form.html',
  styleUrl: './datos-tarjeta.form.css',
})
export class DatosTarjetaForm {
  public datosTarjeta = model.required<TarjetaSimulada>();
}
