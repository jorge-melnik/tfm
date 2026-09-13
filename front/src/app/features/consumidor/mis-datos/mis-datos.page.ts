import { Component, inject, OnInit, signal } from '@angular/core';
import { ConsumidoresService } from '@shared/services/consumidores.service';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';
import { Consumidor } from '@shared/types/user.types';
import { Card, CardModule } from 'primeng/card';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { IconField, IconFieldModule } from 'primeng/iconfield';
import { InputIcon, InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputPasswordModule } from 'primeng/inputpassword';
import { Camera, Envelope, Eye, EyeSlash, IdCard, Key, Phone, Trash } from '@primeicons/angular';
import { environment } from '@env/environment';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-mis-datos',
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
    FileUploadModule,
    FormsModule,
    Phone,
    Envelope,
    IdCard,
    Trash,
    Camera,
  ],
  templateUrl: './mis-datos.page.html',
  styleUrl: './mis-datos.page.css',
})
export class MisDatosPage implements OnInit {
  public userStore = inject(UserStore);
  public consumidoresService = inject(ConsumidoresService);
  public cdnUrl = environment.cdnUrl;
  private _dialogService = inject(DialogService);
  private _router = inject(Router);
  private _authService = inject(AuthService);

  public nombres = signal<string>('');
  public apellidos = signal<string>('');
  public celular = signal<string>('');
  public username = signal<string>('');
  public email = signal<string>('');

  fotoArchivo = signal<File | null>(null);
  fotoPreviewUrl = signal<string | null>(null);

  public async guardar() {
    const usuario = this.userStore.user();
    if (!usuario) return;
    console.log('usuario', usuario);
    if (
      !this.nombres() ||
      !this.apellidos() ||
      !this.celular() ||
      !this.username() ||
      !this.email()
    ) {
      this._dialogService.addError('Todos los campos son obligatorios.');
      return;
    }

    const consumidor: Consumidor = {
      id_consumidor: usuario.id_usuario,
      nombres: this.nombres(),
      apellidos: this.apellidos(),
      celular: this.celular(),
      username: this.username(),
      email: this.email(),
    };
    if (!consumidor) return;
    const { username } = consumidor;
    try {
      await this.consumidoresService.update(username, consumidor);
      //Aca dar de alta la foto. Llamar a presinged y luego actualizar. TOdo esto lo ahce  en el servicio.
      const foto = this.fotoArchivo();
      if (foto) await this.consumidoresService.setFotoPerfil(username, foto);

      await this._authService.getProfile();
      this._dialogService.addSuccess('Datos actualizados correctamente.');
      this._router.navigate(['/', 'consumidor']);
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

  async ngOnInit(): Promise<void> {
    const user = this.userStore.user();
    if (!user) return;
    const consumidor = await this.consumidoresService.getById(user.username);
    this.nombres.set(consumidor.nombres);
    this.apellidos.set(consumidor.apellidos);
    this.celular.set(consumidor.celular);
    this.username.set(consumidor.username);
    this.email.set(consumidor.email);
  }
}
