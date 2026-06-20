import { Component, ChangeDetectionStrategy, inject, resource } from '@angular/core';
import { CarritoService } from '@shared/services/carrito.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { DataView } from 'primeng/dataview';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';
import { environment } from '@env/environment';
import { Tag } from 'primeng/tag';
import { ItemCarrito } from '@shared/types/item-carrito';

@Component({
  selector: 'app-carrito',
  imports: [DataView, ItemCarritoComponent, Tag],
  templateUrl: './carrito.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './carrito.page.css',
})
export class CarritoPage {
  private _carritoService = inject(CarritoService);
  private readonly _preferenciasStore = inject(PreferenciasStore);
  protected readonly cdnUrl = environment.cdnUrl;

  public limit = this._preferenciasStore.limit;

  protected items = this._carritoService.items;

  public onBorrar(item: ItemCarrito) {
    this._carritoService.removeItem(item);
  }

  public onActualizar(item: ItemCarrito) {
    this._carritoService.updateItem(item);
  }
}
