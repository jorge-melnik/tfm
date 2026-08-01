import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoForm } from '@shared/components/producto-form/producto.form';
import { DialogService } from '@shared/services/dialog.service';
import { ProductosProductorService } from '@shared/services/productos-productor.service';
import { PreferenciasStore } from '@shared/services/stores/preferencias.store';
import { UserStore } from '@shared/services/stores/user.store';
import { Producto } from '@shared/types/producto';

@Component({
  selector: 'app-productos-productor-create',
  imports: [ProductoForm],
  templateUrl: './productos-productor-create.page.html',
  styleUrl: './productos-productor-create.page.css',
})
export class ProductosProductorCreatePage {
  private readonly _dialogService = inject(DialogService);
  private readonly _productosService = inject(ProductosProductorService);
  private readonly _router = inject(Router);
  private readonly _userStore = inject(UserStore);

  public productor = input<string>();
  private readonly _route = inject(ActivatedRoute);
  public producto = signal(this._productosService.getProductoVacio());

  public cancelar() {
    this.volver();
  }

  public async guardar(producto: Producto) {
    console.log('guardar');
    try {
      const productor = this.productor();
      const usuario = this._userStore.user();
      if (!productor || !usuario || productor !== usuario.username) {
        throw new Error('No se ha proporcionado un productor válido.');
      }
      producto.productor = productor;
      // producto.id_productor = usuario.id_usuario;
      await this._productosService.create(producto, { productor });
      this.volver();
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }

  public volver() {
    this._router.navigate(['..'], { relativeTo: this._route });
  }
}
