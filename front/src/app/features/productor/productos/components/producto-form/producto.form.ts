import { Component, input } from '@angular/core';
import { Producto } from '@shared/types/producto';

@Component({
  selector: 'app-producto-form',
  imports: [],
  templateUrl: './producto.form.html',
  styleUrl: './producto.form.css',
})
export class ProductoForm {
  private productoVacio = {
    id_productor: '',
    id_subcategoria: 0,
    id_producto: 0,
    categoria: '',
    subcategoria: '',
    nombre: '',
    productor: '',
    producto: '',
    descripcion: '',
    precio: 0,
    cantidad_disponible: 0,
    etiquetas: [],
    fotos: [],
    id_etiquetas: [],
    activo: true,
  };

  //TODO: Poner productoVacío en una store o service ?

  public producto = input<Producto>({ ...this.productoVacio });
}
