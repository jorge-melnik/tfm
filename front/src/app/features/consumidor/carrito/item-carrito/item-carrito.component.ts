import { Component, input, output } from '@angular/core';
import { ItemCarrito, ItemCarritoVerbose } from '@shared/types/item-carrito';
import { CurrencyPipe } from '@angular/common';
import { environment } from '@env/environment';

@Component({
  selector: 'app-item-carrito',
  imports: [CurrencyPipe],
  templateUrl: './item-carrito.component.html',
  styleUrl: './item-carrito.component.css',
})
export class ItemCarritoComponent {
  public item = input.required<ItemCarritoVerbose>();
  public cdnUrl = environment.cdnUrl;
  public actualizar = output<ItemCarrito>();
  public borrar = output<ItemCarrito>();

  cambiarCantidad(nuevaCantidad: number) {
    const item: ItemCarrito = { ...this.item() };
    item.cantidad = nuevaCantidad; //Evitamos modificar la cantidad que muestra el componente.
    this.actualizar.emit(item);
  }

  emitBorrar() {
    this.borrar.emit(this.item());
  }
}
