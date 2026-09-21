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
import { InputPasswordModule } from 'primeng/inputpassword';
import { Key } from '@primeicons/angular/key';
import { Eye, EyeSlash, Phone, Envelope, IdCard, Camera, Trash } from '@primeicons/angular';
import { TextareaModule } from 'primeng/textarea';
import { Profile, RegistroType, Rol } from '@shared/types/user.types';
import { DialogService } from '@shared/services/dialog.service';
import { AuthService } from '@shared/services/auth.service';
import { FileUpload } from 'primeng/fileupload';
import { ProfileService } from '@shared/services/profile.service';
import { form, minLength, required, validate, FormField } from '@angular/forms/signals';
import { Message } from 'primeng/message';

type RegisterLocalType = {
  nombres: string;
  apellidos: string;
  celular: string;
  roles: Rol[];
  presentacion: string;
  username: string;
  email: string;
  password: string;
  password2: string;
};
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
    InputPasswordModule,
    RouterLink,
    Key,
    Eye,
    EyeSlash,
    Phone,
    Envelope,
    IdCard,
    Trash,
    Camera,
    FileUpload,
    FormField,
    Message,
  ],
  templateUrl: './register.page.html',

  styleUrl: './register.page.css',
})
export class RegisterPage {
  private _dialogService = inject(DialogService);
  private _authService = inject(AuthService);
  private _profileService = inject(ProfileService);

  public mask = signal<boolean>(true);

  public roleOptions = [
    { label: 'Comprar', value: 'CONSUMIDOR', icon: 'eye' },
    { label: 'Vender', value: 'PRODUCTOR', icon: 'eye' },
  ];

  public registerModel = signal<RegisterLocalType>({
    nombres: '',
    apellidos: '',
    celular: '',
    presentacion: '',
    username: '',
    email: '',
    password: '',
    password2: '',
    roles: [],
  });

  public registerForm = form(this.registerModel, (path) => {
    required(path.nombres, {
      message: 'Especifica el nombre',
    });
    required(path.apellidos, {
      message: 'Especifica el apellido',
    });
    required(path.celular, {
      message: 'Especifica el celular',
    });
    required(path.username, {
      message: 'Especifica el username',
    });

    minLength(path.username, 5, {
      message: 'Largo mínimo 5 letras',
    });
    required(path.email, {
      message: 'Especifica el email',
    });
    required(path.password, {
      message: 'Especifica el nombre',
    });
    required(path.password2, {
      message: 'Repite el password',
    });
    minLength(path.roles, 1, {
      message: 'Selecciona al menos CONSUMIDOR o PRODUCTOR',
    });
    validate(path.presentacion, () => {
      const tieneRolProductor = this.registerModel().roles.includes('PRODUCTOR');
      const presentacionValue = this.registerModel().presentacion?.trim();
      if (tieneRolProductor && !presentacionValue) {
        return {
          kind: 'required',
          message: 'La presentación es requerida para los productores.',
        };
      }
      return null;
    });
  });

  fotoArchivo = signal<File | null>(null);
  fotoPreviewUrl = signal<string | null>(null);

  public async guardar(event: Event) {
    event.preventDefault();
    console.log('guardar');
    if (this.registerForm().invalid()) {
      console.log('invalida');
      this.registerForm().markAsTouched();
      return;
    }

    console.log('valido');
    const usuario: RegistroType = {
      nombres: this.registerForm.nombres().value(),
      apellidos: this.registerForm.apellidos().value(),
      celular: this.registerForm.celular().value(),
      username: this.registerForm.username().value(),
      email: this.registerForm.email().value(),
      password: this.registerForm.password().value(),
      password2: this.registerForm.password2().value(),
      roles: this.registerForm.roles().value(),
    };
    if (usuario.roles.includes('PRODUCTOR'))
      usuario.productor = {
        presentacion: this.registerForm.presentacion().value(),
      };

    if (usuario.roles.includes('CONSUMIDOR')) usuario.consumidor = {};

    console.log({ usuario });

    try {
      const creado: Profile = await this._authService.register(usuario);
      const foto = this.fotoArchivo();
      if (foto) {
        await this._profileService.setFotoPerfil(usuario.username, usuario.roles[0], foto);
      }
      await this._authService.goToUserHome();
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }

  onFotoSeleccionada(event: any): void {
    const file = event.currentFiles?.[0];
    if (file) {
      this.fotoArchivo.set(file);
    }
  }

  eliminarFoto(removeCallback: Function, event: Event): void {
    removeCallback(event, 0); // Ejecuta la limpieza interna de PrimeNG
    this.fotoArchivo.set(null);
  }
}
