import { Component, computed, inject, OnInit, resource, signal } from '@angular/core';
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
import { UsuariosService } from '@shared/services/usuarios.service.ts';
import { Select } from 'primeng/select';
import { Ubicacion } from '@shared/types/ubicacion';
import { FormsModule } from '@angular/forms';
import { Check, Phone } from '@primeicons/angular';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-carrito',
  imports: [
    DataView,
    ItemCarritoComponent,
    Tag,
    ButtonDirective,
    Select,
    FormsModule,
    Check,
    FloatLabel,
    IconField,
    InputIcon,
    Phone,
    InputTextModule,
  ],
  templateUrl: './carrito.page.html',

  styleUrl: './carrito.page.css',
})
export class CarritoPage implements OnInit {
  async ngOnInit(): Promise<void> {
    this._carritoService.recargarCarrito();
  }
  private readonly _router = inject(Router);
  private readonly usuariosService = inject(UsuariosService);
  private _carritoService = inject(CarritoService);
  public readonly _preferenciasStore = inject(PreferenciasStore);
  public readonly userStore = inject(UserStore);
  private readonly _dialogService = inject(DialogService);
  private readonly _comprasService = inject(ComprasService);
  protected readonly cdnUrl = environment.cdnUrl;

  protected items = this._carritoService.productos;

  protected totalCarrito = this._carritoService.totalCarrito;

  public contacto_receptor = signal<string>('');

  public ubicacionesResource = resource({
    params: () => {
      const username = this.userStore.user()?.username;
      if (!username) return undefined;
      return { username };
    },
    loader: async ({ params }) => {
      const { username } = params;
      return this.usuariosService.getUbicaciones(username);
    },
  });

  public ubicaciones = computed(() => this.ubicacionesResource.value() ?? []);

  public ubicacionSeleccionada = signal<Ubicacion | null>(null);

  public async onBorrar(item: ItemCarrito) {
    try {
      await this._carritoService.removeItem(item);
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }

  public async onActualizar(item: ItemCarrito) {
    try {
      await this._carritoService.updateItem(item);
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }

  public async confirmarCompra() {
    try {
      const username = this.userStore.user()?.username;
      const ubicacion = this.ubicacionSeleccionada();
      const contacto = this.contacto_receptor();

      if (!username || !ubicacion || !contacto) return;
      const datos: CompraPOST = {
        direccion_envio: `${ubicacion.direccion} (${(ubicacion.localidad, ubicacion.departamento)})`,
        contacto_receptor: contacto,
      };

      //TODO: Falta agregar direccion envio y contacto en el formulario
      const compra = await this._comprasService.create(datos, { username });
      this._carritoService.recargarCarrito();
      this.contacto_receptor.set('');
      this.ubicacionSeleccionada.set(null);
      this._router.navigate(['consumidor', 'compras', compra.id_compra]);
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }
}
