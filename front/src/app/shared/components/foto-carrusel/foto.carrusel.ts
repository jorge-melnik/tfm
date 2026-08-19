import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { environment } from '@env/environment';
import { ImagenProducto } from '@shared/types/producto';

@Component({
  selector: 'app-foto-carrusel',
  imports: [],
  templateUrl: './foto.carrusel.html',

  styleUrl: './foto.carrusel.css',
})
export class FotoCarrusel {
  fotos = input.required<ImagenProducto[]>();
  cdnUrl = environment.cdnUrl;
  altText = input.required<string>();

  indiceActual = signal<number>(0);

  anterior(event: Event) {
    event.stopPropagation();
    if (this.indiceActual() > 0) {
      this.indiceActual.update((i) => i - 1);
    }
  }

  siguiente(event: Event) {
    event.stopPropagation();
    if (this.indiceActual() < this.fotos().length - 1) {
      this.indiceActual.update((i) => i + 1);
    }
  }
}
