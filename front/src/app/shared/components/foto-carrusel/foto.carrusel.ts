import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-foto-carrusel',
  imports: [],
  templateUrl: './foto.carrusel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './foto.carrusel.css',
})
export class FotoCarrusel {
  fotos = input.required<string[]>();
  cdnUrl = input.required<string>();
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
