import { Component, computed, inject, OnInit, resource, signal } from '@angular/core';
import { CarritoService } from '@shared/services/carrito.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { DataView } from 'primeng/dataview';
import { ItemCarritoComponent } from './item-carrito/item-carrito.component';
import { environment } from '@env/environment';
import { Tag } from 'primeng/tag';
import { ItemCarrito } from '@shared/types/item-carrito';
import { DialogService } from '@shared/services/dialog.service';
import { ComprasService } from '@shared/services/compras.service';
import { UserStore } from '@shared/services/stores/user.store';
import { CompraPOST } from '@shared/types/compra';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '@shared/services/usuarios.service.ts';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Check, Phone } from '@primeicons/angular';
import { FloatLabel } from 'primeng/floatlabel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { form, required, FormField } from '@angular/forms/signals';
import { Ubicacion } from '@shared/types/ubicacion';
import { ButtonModule } from 'primeng/button';

type DatosEnvio = {
  contacto_receptor: string;
  id_ubicacion: number | null;
};

@Component({
  selector: 'app-carrito',
  imports: [
    DataView,
    ItemCarritoComponent,
    Tag,
    ButtonModule,
    Select,
    FormsModule,
    Check,
    FloatLabel,
    IconField,
    InputIcon,
    Phone,
    InputTextModule,
    FormField,
    RouterLink,
  ],
  templateUrl: './carrito.page.html',

  styleUrl: './carrito.page.css',
})
export class CarritoPage implements OnInit {
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

  public datosEnvio = signal<DatosEnvio>({ contacto_receptor: '', id_ubicacion: null });

  public ubicacionSeleccionada = computed(() => {
    const id_ubicacion: number | null = this.datosEnvio().id_ubicacion;
    const ubicaciones: Ubicacion[] | undefined = this.ubicaciones();
    if (!id_ubicacion || !ubicaciones) return;
    return ubicaciones.find((u) => u.id_ubicacion === id_ubicacion);
  });

  public datosEnvioForm = form(this.datosEnvio, (path) => {
    required(path.contacto_receptor, {
      message: 'Por favor completa el contacto receptor',
    });

    required(path.id_ubicacion, {
      message: 'Ingresa donde quieres recibir el pedido.',
    });
  });

  public ubicaciones = signal<Ubicacion[]>([]);

  async ngOnInit(): Promise<void> {
    this._carritoService.recargarCarrito();
    const username = this.userStore.user()?.username;
    if (!username) return;
    const ubicaciones = await this.usuariosService.getUbicaciones(username);
    this.ubicaciones.set(ubicaciones);
    const id_ubicacion = ubicaciones.length > 0 ? ubicaciones[0].id_ubicacion : null;
    this.datosEnvio.set({ ...this.datosEnvio(), id_ubicacion });
  }

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

  public async confirmarCompra(event: Event) {
    event.preventDefault();
    if (!this.datosEnvioForm().valid()) {
      this.datosEnvioForm().markAsTouched();
      this._dialogService.addWarn('Por favor, completa los datos para el envío.');
      return;
    }
    try {
      const username = this.userStore.user()?.username;
      const ubicacion = this.ubicacionSeleccionada();
      if (!ubicacion) {
        this._dialogService.addWarn('Selecciona la ubicación de envío.');
        return;
      }
      const contacto = this.datosEnvio().contacto_receptor;
      const direccionEnvio = `${ubicacion.direccion} (${(ubicacion.localidad, ubicacion.departamento)})`;

      if (!username || !ubicacion || !contacto || !direccionEnvio) return;
      const datos: CompraPOST = {
        direccion_envio: direccionEnvio,
        contacto_receptor: contacto,
      };

      const compra = await this._comprasService.create(datos, { username });
      this._carritoService.recargarCarrito();
      this.datosEnvio.set({ contacto_receptor: '', id_ubicacion: null });
      this._router.navigate(['consumidor', 'compras', compra.id_compra]);
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }
}
