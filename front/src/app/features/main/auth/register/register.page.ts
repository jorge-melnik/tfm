import { Component, inject, signal } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { InputPasswordModule } from 'primeng/inputpassword';
import { Key } from '@primeicons/angular/key';
import { Eye, EyeSlash, ShoppingBag, Phone, Envelope, IdCard } from '@primeicons/angular';
import { TextareaModule } from 'primeng/textarea';
import { RegistroType, Rol } from '@shared/types/user.types';
import { DialogService } from '@shared/services/dialog.service';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TextareaModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterLink,
    SelectButtonModule,
    FormsModule,
    InputPasswordModule,
    FormsModule,
    RouterLink,
    Key,
    Eye,
    EyeSlash,
    Phone,
    Envelope,
    IdCard,
  ],
  templateUrl: './register.page.html',

  styleUrl: './register.page.css',
})
export class RegisterPage {
  private _dialogService = inject(DialogService);
  private _authService = inject(AuthService);

  public selectedRoles = signal<Rol[]>([]);

  public mask = signal<boolean>(true);

  public roleOptions = [
    { label: 'Comprar', value: 'CONSUMIDOR', icon: 'eye' },
    { label: 'Vender', value: 'PRODUCTOR', icon: 'eye' },
  ];

  public nombres = signal<string>('');
  public apellidos = signal<string>('');
  public celular = signal<string>('');
  public presentacion = signal<string>('');
  public username = signal<string>('');
  public email = signal<string>('');
  public password = signal<string>('');
  public password2 = signal<string>('');

  public async guardar() {
    console.log('guardar');
    const usuario: RegistroType = {
      nombres: this.nombres(),
      apellidos: this.apellidos(),
      celular: this.celular(),
      username: this.username(),
      email: this.email(),
      password: this.password(),
      password2: this.password2(),
      roles: this.selectedRoles(),
    };
    if (this.selectedRoles().includes('PRODUCTOR'))
      usuario.productor = {
        presentacion: this.presentacion(),
      };

    console.log({ usuario });

    try {
      await this._authService.register(usuario);
      await this._authService.goToUserHome();
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }
}
