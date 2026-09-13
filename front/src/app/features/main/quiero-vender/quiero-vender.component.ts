import { Component, inject, signal, resource, computed } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { TextareaModule } from 'primeng/textarea';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';

import { IftaLabelModule, IftaLabel } from 'primeng/iftalabel';
import { DialogService } from '@shared/services/dialog.service';
import { AuthService } from '@shared/services/auth.service';
import { FormArray, FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';
import { AdicionalesProductor } from '@shared/types/user.types';
import { MessageModule } from 'primeng/message';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { ProductoresService } from '@shared/services/productores.service';
import { UsuariosService } from '@shared/services/usuarios.service.ts';
import { environment } from '@env/environment';

@Component({
  selector: 'app-quiero-vender',
  imports: [
    TextareaModule,
    Card,
    ButtonDirective,
    IftaLabel,
    FormField,
    IftaLabelModule,
    MessageModule,
    FloatLabel,
    Select,
    RouterLink,
  ],
  templateUrl: './quiero-vender.component.html',

  styleUrl: './quiero-vender.component.css',
})
export class QuieroVenderComponent {
  private _dialogService = inject(DialogService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  public userStore = inject(UserStore);
  public productoresService = inject(ProductoresService);
  private readonly _usuariosService = inject(UsuariosService);

  public cdnUrl = environment.cdnUrl;

  model = signal<AdicionalesProductor>({ presentacion: '', id_ubicacion: null });
  loginForm = form(this.model, (path) => {
    required(path.presentacion, {
      message: 'Por favor completa tu presentación',
    });
    required(path.id_ubicacion!, {
      message: 'Para vender debes indicar la ubicación donde se producen los productos.',
    });
  });

  private ubicacionesResource = resource({
    params: () => {
      const username = this.userStore.user()?.username;
      if (!username) return undefined;
      return { username };
    },
    loader: async ({ params }) => {
      const { username } = params;
      return this._usuariosService.getUbicaciones(username);
    },
  });

  public ubicaciones = computed(() => this.ubicacionesResource.value() ?? []);

  async guardar(event: Event) {
    event.preventDefault();
    if (!this.loginForm().valid()) {
      this.loginForm().markAsTouched();
      this._dialogService.addError('Por favor, complete todos los campos requeridos.');
      return;
    }

    await this._authService.activarProductor({
      presentacion: this.model().presentacion,
      id_ubicacion: this.model().id_ubicacion,
    });
    this._dialogService.addSuccess('¡Felicidades! Ahora eres un productor.');
    this._router.navigate(['/productor']);
  }
}
