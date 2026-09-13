import { Component, computed, inject, OnInit, resource, signal } from '@angular/core';
import { DialogService } from '@shared/services/dialog.service';
import { UserStore } from '@shared/services/stores/user.store';
import { Productor } from '@shared/types/user.types';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
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
import { ProductoresService } from '@shared/services/productores.service';
import { AuthService } from '@shared/services/auth.service';
import { UsuariosService } from '@shared/services/usuarios.service.ts';
import { Select, SelectModule } from 'primeng/select';

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
    SelectModule,
  ],
  templateUrl: './mis-datos.page.html',
  styleUrl: './mis-datos.page.css',
})
export class MisDatosPage implements OnInit {
  public userStore = inject(UserStore);
  public productoresService = inject(ProductoresService);
  private readonly _usuariosService = inject(UsuariosService);
  private _authService = inject(AuthService);
  public cdnUrl = environment.cdnUrl;
  private _dialogService = inject(DialogService);
  private _router = inject(Router);

  public nombres = signal<string>('');
  public apellidos = signal<string>('');
  public celular = signal<string>('');
  public username = signal<string>('');
  public email = signal<string>('');
  public presentacion = signal<string>('');
  public id_ubicacion = signal<number>(0);

  fotoArchivo = signal<File | null>(null);
  fotoPreviewUrl = signal<string | null>(null);

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

  public async guardar() {
    const usuario = this.userStore.user();
    if (!usuario) return;
    const id_ubicacion = this.id_ubicacion();
    console.log('usuario', usuario);
    if (
      !this.nombres() ||
      !this.apellidos() ||
      !this.celular() ||
      !this.username() ||
      !this.email() ||
      !this.presentacion() ||
      !this.id_ubicacion()
    ) {
      console.log({ id_ubicacion });
      this._dialogService.addError('Todos los campos son obligatorios.');

      return;
    }

    const productor: Productor = {
      id_productor: usuario.id_usuario,
      nombres: this.nombres(),
      apellidos: this.apellidos(),
      celular: this.celular(),
      username: this.username(),
      email: this.email(),
      presentacion: this.presentacion(),
      id_ubicacion: this.id_ubicacion(),
    };

    if (!productor) return;
    const { username } = productor;
    try {
      await this.productoresService.update(username, productor, { username: productor.username });
      const foto = this.fotoArchivo();
      if (foto) {
        //FIXME: Por ahora no se puede simplemente borrar la foto de perfil.
        await this.productoresService.setFotoPerfil(username, foto);
      }
      await this._authService.getProfile();
      this._dialogService.addSuccess('Datos actualizados correctamente.');
      this._router.navigate(['/', 'productor', productor.username]);
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
    const productor = await this.productoresService.getById(user.username);
    this.nombres.set(productor.nombres);
    this.apellidos.set(productor.apellidos);
    this.celular.set(productor.celular);
    this.username.set(productor.username);
    this.email.set(productor.email);
    this.presentacion.set(productor.presentacion);
    this.id_ubicacion.set(productor.id_ubicacion);
  }
}
