import { Component, inject, OnInit, signal } from '@angular/core';
import { CarritoService } from '@shared/services/carrito.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { DataView } from 'primeng/dataview';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';
import { environment } from '@env/environment';
import { Tag } from 'primeng/tag';
import { ItemCarrito } from '@shared/types/item-carrito';
import { DialogService } from '@shared/services/dialog.service';
import { ButtonDirective } from 'primeng/button';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { CompraPOST } from '@shared/types/compra';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [DataView, ItemCarritoComponent, Tag, ButtonDirective],
  templateUrl: './carrito.page.html',

  styleUrl: './carrito.page.css',
})
export class CarritoPage implements OnInit {
  async ngOnInit(): Promise<void> {
    this._carritoService.recargarCarrito();
  }
  private readonly _router = inject(Router);
  private _carritoService = inject(CarritoService);
  public readonly _preferenciasStore = inject(PreferenciasStore);
  public readonly userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _comprasService = inject(ComprasService);
  protected readonly cdnUrl = environment.cdnUrl;

  protected items = this._carritoService.productos;

  protected totalCarrito = this._carritoService.totalCarrito;

  public direccion_envio = signal<string>('');
  public contacto_receptor = signal<string>('');

  public async onBorrar(item: ItemCarrito) {
    try {
      await this._carritoService.removeItem(item);
    } catch (error: any) {
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

  public async confirmarCompra() {
    try {
      const username = this.userStore.user()?.username;
      if (!username) return;
      const datos: CompraPOST = {
        direccion_envio: this.direccion_envio(),
        contacto_receptor: this.contacto_receptor(),
      };

      //TODO: Falta agregar direccion envio y contacto en el formulario
      const compra = await this._comprasService.create(datos, { username });
      this._router.navigate(['consumidor', 'compras', compra.id_compra]);
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }
}
