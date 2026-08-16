import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedioPago } from '@shared/types/compra';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-medios-pago-selector',
  imports: [RadioButtonModule, FormsModule],
  templateUrl: './medios-pago.selector.html',
  styleUrl: './medios-pago.selector.css',
})
export class MediosPagoSelector {
  public mediosDePago = input.required<MedioPago[]>();
  public medioDePagoSeleccionado = model.required<string>();
}
