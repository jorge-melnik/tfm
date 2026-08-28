import { Component, computed, inject, input, OnInit, resource, signal } from '@angular/core';
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
import { Pregunta } from '@shared/types/preguntas';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { PreguntasService } from '@shared/services/preguntas-service';
import { ApiQueryParams } from '@shared/types/api.types';

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
export class ProductosProductorViewPage implements OnInit {
  private _productosService = inject(ProductosProductorService);
  private _preguntasService = inject(PreguntasService);
  public paginationStore = inject(PaginationStore);
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

  private preguntasResource = resource({
    params: () => {
      const productor = this.productor();
      const producto = this.producto();
      if (!producto || !productor) return undefined;

      return {
        productor,
        producto,
        limit: this.paginationStore.limit(),
        page: this.paginationStore.page(),
        sort: this.paginationStore.sortField(),
        sort_direction: this.paginationStore.sortOrder() === -1 ? 'DESC' : 'ASC',
      };
    },
    loader: async ({ params }) => {
      const { producto, productor, limit, page, sort, sort_direction } = params;
      const queryParams: ApiQueryParams = {};
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };

      const pathParams = { productor, producto };
      return this._preguntasService.getBy({ queryParams, pagination, pathParams });
    },
  });

  public preguntas = computed(() => this.preguntasResource.value()?.data);

  public totalPreguntas = computed<number>(() => {
    return this.preguntasResource.value()?.meta.total || 0;
  });

  async ngOnInit(): Promise<void> {
    this.paginationStore.resetPagination();
  }

  public volver() {
    this._location.back();
  }
}
