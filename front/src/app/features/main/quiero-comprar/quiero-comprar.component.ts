import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';
import { AdicionalesConsumidor } from '@shared/types/user.types';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-quiero-comprar',
  imports: [Card, ButtonModule],
  templateUrl: './quiero-comprar.component.html',

  styleUrl: './quiero-comprar.component.css',
})
export class QuieroComprarComponent {
  private _dialogService = inject(DialogService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _userStore = inject(UserStore);

  model = signal<AdicionalesConsumidor>({});
  loginForm = form(this.model, (path) => {});

  async guardar(event: Event) {
    event.preventDefault();
    if (!this.loginForm().valid()) {
      this.loginForm().markAsTouched();
      this._dialogService.addError('Por favor, complete todos los campos requeridos.');
      return;
    }

    await this._authService.activarConsumidor({});
    this._dialogService.addSuccess('¡Felicidades! Ahora eres un consumidor.');
    this._router.navigate(['/consumidor']);
  }
}
