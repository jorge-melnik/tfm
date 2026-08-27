import { Component, computed, inject, input, resource, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe, Location } from '@angular/common';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ProductosProductorService } from '@shared/services/productos-productor.service';
import { FotoCarrusel } from '@shared/components/foto-carrusel/foto.carrusel';
import { environment } from '@env/environment';

export interface Pregunta {
  id: string;
  usuario: string;
  fecha: Date;
  pregunta: string;
  respuesta?: {
    fecha: Date;
    texto: string;
  };
}

@Component({
  selector: 'app-productos-productor-view',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    TitleCasePipe,
    CardModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    PaginatorModule,
    TextareaModule,
    FormsModule,
    FotoCarrusel,
  ],
  templateUrl: './productos-productor-view.page.html',
  styleUrl: './productos-productor-view.page.css',
})
export class ProductosProductorViewPage {
  private _productosService = inject(ProductosProductorService);
  public productor = input.required<string>();
  public producto = input.required<string>();

  private readonly _location = inject(Location);

  public cdnUrl = environment.cdnUrl;

  public productoResource = resource({
    params: () => {
      const productor = this.productor();
      const producto = this.producto();
      if (!producto || !productor) return undefined;

      return {
        productor,
        producto,
      };
    },
    loader: async ({ params }) => {
      const { producto, productor } = params;
      return this._productosService.getById(productor, producto);
    },
  });

  public productoData = computed(() => this.productoResource.value());

  // Estado para la galería
  public indiceFotoSeleccionada = signal<number>(0);

  // Preguntas y Paginación
  public nuevaPregunta = signal<string>('');
  public first = signal<number>(0);
  public rows = signal<number>(3);

  public preguntas = signal<Pregunta[]>([
    {
      id: '1',
      usuario: 'Carlos M.',
      fecha: new Date('2026-02-10'),
      pregunta: '¿Tienen stock disponible para entrega inmediata?',
      respuesta: {
        fecha: new Date('2026-02-10'),
        texto: '¡Hola Carlos! Sí, tenemos stock disponible y despachamos en 24hs.',
      },
    },
    {
      id: '2',
      usuario: 'Lucía G.',
      fecha: new Date('2026-02-05'),
      pregunta: '¿Es libre de gluten / Sin TACC?',
      respuesta: {
        fecha: new Date('2026-02-06'),
        texto: 'Hola Lucía, así es. Cuenta con certificación oficial Sin TACC.',
      },
    },
    {
      id: '3',
      usuario: 'Martín R.',
      fecha: new Date('2026-01-28'),
      pregunta: '¿Hacen envíos al interior?',
      respuesta: {
        fecha: new Date('2026-01-28'),
        texto: 'Hola Martín, hacemos envíos a todo el país por agencias de carga.',
      },
    },
    {
      id: '4',
      usuario: 'Ana P.',
      fecha: new Date('2026-01-15'),
      pregunta: '¿Qué fecha de vencimiento tiene el lote actual?',
    },
  ]);

  // Preguntas paginadas
  public preguntasPaginadas = computed(() => {
    const inicio = this.first();
    const fin = inicio + this.rows();
    return this.preguntas().slice(inicio, fin);
  });

  public onPageChange(event: PaginatorState): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 3);
  }

  public enviarPregunta(): void {
    if (!this.nuevaPregunta().trim()) return;

    const nueva: Pregunta = {
      id: Date.now().toString(),
      usuario: 'Usuario Actual',
      fecha: new Date(),
      pregunta: this.nuevaPregunta().trim(),
    };

    this.preguntas.update((lista) => [nueva, ...lista]);
    this.nuevaPregunta.set('');
  }

  public volver() {
    this._location.back();
  }
}
