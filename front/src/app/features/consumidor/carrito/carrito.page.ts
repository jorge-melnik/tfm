import { Component, ChangeDetectionStrategy, inject, resource, computed } from '@angular/core';
import { CarritoService } from '@shared/services/carrito.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { DataView } from 'primeng/dataview';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';
import { environment } from '@env/environment';
import { Tag } from 'primeng/tag';
import { ItemCarrito } from '@shared/types/item-carrito';
import { DialogService } from '@shared/services/dialog.service';
import { Button } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-carrito',
  imports: [DataView, ItemCarritoComponent, Tag, Button, CurrencyPipe],
  templateUrl: './carrito.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './carrito.page.css',
})
export class CarritoPage {
  private _carritoService = inject(CarritoService);
  private readonly _preferenciasStore = inject(PreferenciasStore);
  private readonly _dialogService = inject(DialogService);
  protected readonly cdnUrl = environment.cdnUrl;

  public limit = this._preferenciasStore.limit;

  protected items = this._carritoService.items;

  protected totalCarrito = this._carritoService.totalCarrito;

  public async onBorrar(item: ItemCarrito) {
    try {
      await this._carritoService.removeItem(item);
    } catch (error: any) {
      console.error(error);
      this._dialogService.addError('No se pudo eliminar el item del carrito.');
    }
  }

  public async onActualizar(item: ItemCarrito) {
    try {
      await this._carritoService.updateItem(item);
    } catch (error: any) {
      console.error(error);
      this._dialogService.addError('No se pudo actualizar el item del carrito.');
    }
  }
}
