import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { TextareaModule } from 'primeng/textarea';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';

import { IftaLabelModule, IftaLabel } from 'primeng/iftalabel';
import { DialogService } from '@shared/services/dialog.service';
import { AuthService } from '@shared/services/auth.service';
import { FormArray, FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';
import { AdicionalesProductor } from '@shared/types/user.types';
import { MessageModule } from 'primeng/message';

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
  ],
  templateUrl: './quiero-vender.component.html',

  styleUrl: './quiero-vender.component.css',
})
export class QuieroVenderComponent {
  private _dialogService = inject(DialogService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _userStore = inject(UserStore);

  model = signal<AdicionalesProductor>({ presentacion: '' });
  loginForm = form(this.model, (path) => {
    required(path.presentacion, {
      message: 'Por favor completa tu presentación',
    });
  });

  async guardar(event: Event) {
    event.preventDefault();
    if (!this.loginForm().valid()) {
      this.loginForm().markAsTouched();
      this._dialogService.addError('Por favor, complete todos los campos requeridos.');
      return;
    }

    await this._authService.activarProductor({ presentacion: this.model().presentacion });
    this._dialogService.addSuccess('¡Felicidades! Ahora eres un productor.');
    //TODO: recargar el usuario para que se actualice el rol en el store
    this._router.navigate(['/productor']);
  }
}
