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
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { PreguntasService } from '@shared/services/preguntas-service';
import { ApiQueryParams, PathParams } from '@shared/types/api.types';
import { Ban, CartPlus, Send } from '@primeicons/angular';
import { CarritoService } from '@shared/services/carrito.service';
import { UserStore } from '@shared/services/stores/user.store';
import { DialogService } from '@shared/services/dialog.service';

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
    CartPlus,
    Ban,
    Send,
  ],
  templateUrl: './productos-productor-view.page.html',
  styleUrl: './productos-productor-view.page.css',
})
export class ProductosProductorViewPage implements OnInit {
  private _productosService = inject(ProductosProductorService);
  private _preguntasService = inject(PreguntasService);
  private _dialogService = inject(DialogService);
  public paginationStore = inject(PaginationStore);
  public productor = input.required<string>();
  public producto = input.required<string>();
  public carritoService = inject(CarritoService);
  public usuarioStore = inject(UserStore);

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

  public indiceFotoSeleccionada = signal<number>(0);

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

  public esDuenioDelProducto = computed(() => {
    const productor = this.productor();
    const username = this.usuarioStore.user()?.username;

    if (!productor || !username) return false;
    return productor === username;
  });

  public preguntaAResponderId = signal<number | null>(null);
  public contenidoRespuesta = signal<string>('');

  public activarFormularioRespuesta(idPregunta: number) {
    if (this.preguntaAResponderId() === idPregunta) {
      this.cancelarRespuesta();
    } else {
      this.preguntaAResponderId.set(idPregunta);
      this.contenidoRespuesta.set('');
    }
  }

  public cancelarRespuesta() {
    this.preguntaAResponderId.set(null);
    this.contenidoRespuesta.set('');
  }

  async responderPregunta(idPregunta: number) {
    const contenido = this.contenidoRespuesta().trim();
    const productor = this.productor();
    const producto = this.producto();

    if (!contenido || !idPregunta || !productor || !producto) return;

    try {
      await this._preguntasService.responderPregunta(productor, producto, idPregunta, contenido);

      this.cancelarRespuesta();
      this.preguntasResource.reload();
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }

  async ngOnInit(): Promise<void> {
    this.paginationStore.resetPagination();
  }

  async agregarPregunta() {
    const producto = this.producto();
    const productor = this.productor();
    const id_producto = this.productoData()?.id_producto;
    const id_consumidor = this.usuarioStore.user()?.id_usuario;
    const contenido: string = this.nuevaPregunta();
    if (!productor || !producto || !contenido || !id_producto || !id_consumidor) return;
    const pathParams: PathParams = {
      productor,
      producto,
    };

    try {
      await this._preguntasService.create({ id_producto, id_consumidor, contenido }, pathParams);
      this.preguntasResource.reload();
      this.nuevaPregunta.set('');
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }

  public volver() {
    this._location.back();
  }
}
