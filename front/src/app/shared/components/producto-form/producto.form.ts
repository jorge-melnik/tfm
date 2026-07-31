import { Component, inject, input, OnInit, output } from '@angular/core';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { Form, FormsModule } from '@angular/forms';
import { Producto } from '@shared/types/producto';
import { ButtonModule } from 'primeng/button';
import { EtiquetasStore } from '@shared/services/stores/etiquetas.store';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';

@Component({
  selector: 'app-producto-form',
  imports: [
    ButtonModule,
    Card,
    FloatLabel,
    IconField,
    InputIcon,
    Select,
    InputNumber,
    FormsModule,
    InputText,
    Textarea,
  ],
  templateUrl: './producto.form.html',
  styleUrl: './producto.form.css',
})
export class ProductoForm implements OnInit {
  public producto = input.required<Producto>();
  public etiquetasStore = inject(EtiquetasStore);

  public guardar = output<Producto>();
  public cancelar = output();

  ngOnInit(): void {
    this.etiquetasStore.setCategoriaSeleccionada(this.producto().categoria);
    this.etiquetasStore.setSubcategoriaSeleccionada(this.producto().subcategoria);
    this.etiquetasStore.setEtiquetasSeleccionadas(this.producto().etiquetas);
  }

  public guardarProducto(productoForm: Form) {
    console.log('guardarProducto');
    // this.guardar.emit();
  }
}
