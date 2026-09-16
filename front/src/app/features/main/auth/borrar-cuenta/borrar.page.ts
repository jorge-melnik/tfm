import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { Trash } from '@primeicons/angular';
import { AuthService } from '@shared/services/auth.service';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Checkbox } from 'primeng/checkbox';

@Component({
  selector: 'app-borrar',
  imports: [Card, Checkbox, FormsModule, ButtonModule, Trash],
  templateUrl: './borrar.page.html',
  styleUrl: './borrar.page.css',
})
export class BorrarPage {
  private _authService = inject(AuthService);
  private _dialogService = inject(DialogService);

  public userStore = inject(UserStore);
  public cdnUrl = environment.cdnUrl;
  confirmado = signal<boolean>(false);

  async eliminarCuenta() {
    if (!this.confirmado()) return;
    await this._authService.borrarCuenta();
    this._dialogService.addSuccess('Su cuenta ha sido borrada.');
  }
}
