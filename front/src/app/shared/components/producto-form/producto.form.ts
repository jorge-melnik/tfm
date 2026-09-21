import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { PostProducto, Producto } from '@shared/types/producto';
import { ButtonModule } from 'primeng/button';
import { EtiquetasStore } from '@shared/services/stores/etiquetas.store';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { form, maxLength, min, minLength, required, FormField } from '@angular/forms/signals';
import { Message } from 'primeng/message';
import { UserStore } from '@shared/services/stores/user.store';

@Component({
  selector: 'app-producto-form',
  imports: [
    ButtonModule,
    FloatLabel,
    IconField,
    InputIcon,
    Select,
    InputNumber,
    InputText,
    Textarea,
    FormField,
    Message,
  ],
  templateUrl: './producto.form.html',
  styleUrl: './producto.form.css',
})
export class ProductoForm implements OnInit {
  public producto = input.required<Producto>();
  public etiquetasStore = inject(EtiquetasStore);
  public userStore = inject(UserStore);

  public guardar = output<PostProducto>();
  public cancelar = output();

  public productoTemporal = signal<PostProducto>({
    productor: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    cantidad_disponible: 0,
    categoria: '',
    subcategoria: '',
    etiquetas: [],
  });
  public productoForm = form(this.productoTemporal, (path) => {
    required(path.productor, {
      message: 'No especificaste el productor',
    });
    required(path.nombre, {
      message: 'No especificaste el nombre',
      when: ({ state }) => state.touched(),
    });
    minLength(path.nombre, 3, {
      message: 'Incluye por lo menos 3 caracteres',
      when: ({ state }) => state.touched(),
    });

    maxLength(path.nombre, 35, {
      message: 'Máximo 35 caracteres',
      when: ({ state }) => state.touched(),
    });
    required(path.descripcion, {
      message: 'No especificaste la descripción',
      when: ({ state }) => state.touched(),
    });
    required(path.precio, {
      message: 'No especificaste el precio',
      when: ({ state }) => state.touched(),
    });
    required(path.cantidad_disponible, {
      message: 'No especificaste el stock',
      when: ({ state }) => state.touched(),
    });

    min(path.cantidad_disponible, 0, { message: 'No puedes especificar un stock menor a cero.' });
    required(path.categoria, {
      message: 'No especificaste la categoría',
      when: ({ state }) => state.touched(),
    });
    required(path.subcategoria, {
      message: 'No especificaste la subcategoría',
      when: ({ state }) => state.touched(),
    });
    required(path.etiquetas, {
      message: 'No especificaste etiquetas',
      when: ({ state }) => state.touched(),
    });
    minLength(path.etiquetas, 1, {
      message: 'Incluye por lo menos 1 etiqueta',
      when: ({ state }) => state.touched(),
    });
    min(path.precio, 1, { message: 'No puedes especificar un precio menor a uno.' });
  });

  ngOnInit(): void {
    this.etiquetasStore.setCategoriaSeleccionada(this.producto().categoria);
    this.etiquetasStore.setSubcategoriaSeleccionada(this.producto().subcategoria);
    this.etiquetasStore.setEtiquetasSeleccionadas(this.producto().etiquetas);
    const producto = {
      ...this.producto(),
    };
    if (!producto.productor) {
      producto.productor = this.userStore.user()?.username || '';
    }
    this.productoTemporal.set(producto);
  }

  public guardarProducto(event: Event) {
    event.preventDefault();

    console.log('Emit guardar producto', { producto: this.productoForm().value() });
    if (!this.productoForm().valid()) {
      this.productoForm().markAsTouched();
      return;
    }
    const productoActualizado: PostProducto = this.productoForm().value();

    this.guardar.emit(productoActualizado);
  }
}
