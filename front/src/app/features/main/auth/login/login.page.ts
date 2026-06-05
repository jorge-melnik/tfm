import { Component, inject, signal } from '@angular/core';
import { CardModule } from 'primeng/card';

import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { TipoLogin } from '@shared/types/user.types';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-login',
  imports: [
    CardModule,
    ButtonModule,
    PasswordModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    InputGroupAddonModule,
    SelectButtonModule,
    InputTextModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  private _authService = inject(AuthService);
  private _dialogService = inject(DialogService);

  public username = signal<string>('');
  public email = signal<string>('');
  public password = signal<string>('');

  loginOptions: any[] = [
    { label: 'Email', value: 'email', icon: 'pi pi-envelope' },
    { label: 'Usuario', value: 'username', icon: 'pi pi-user' },
  ];

  selectedMethod = signal<TipoLogin>('email');

  public async doLogin() {
    try {
      const selectedMetod = this.selectedMethod();
      if (selectedMetod === 'email')
        await this._authService.doEmailLogin(this.email(), this.password());
      if (selectedMetod === 'username')
        await this._authService.doUsernameLogin(this.username(), this.password());
      await this._authService.goToUserHome();
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }
}
