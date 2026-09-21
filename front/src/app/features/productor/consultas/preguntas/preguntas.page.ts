import { Component, computed, inject, input, OnInit, resource, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { PreguntasService } from '@shared/services/preguntas-service';
import { UserStore } from '@shared/services/stores/user.store';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { ApiQueryParams } from '@shared/types/api.types';
import { PreguntaCard } from '@shared/components/pregunta-card/pregunta.card';
import { Pregunta, RespuestaPost } from '@shared/types/preguntas';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-preguntas',
  imports: [
    CommonModule,
    FormsModule,
    TextareaModule,
    ButtonModule,
    CardModule,
    AvatarModule,
    TagModule,
    ToastModule,
    PreguntaCard,
  ],
  templateUrl: './preguntas.page.html',
  styleUrl: './preguntas.page.css',
})
export class PreguntasPage implements OnInit {
  private _preguntasService = inject(PreguntasService);
  private _userStore = inject(UserStore);
  public paginationStore = inject(PaginationStore);
  private _dialogService = inject(DialogService);

  public productor = input.required<string>();

  private preguntasResource = resource({
    params: () => {
      const productor = this.productor();

      if (!productor) return undefined;

      return {
        productor,
        limit: this.paginationStore.limit(),
        page: this.paginationStore.page(),
        sort: this.paginationStore.sortField(),
        sort_direction: this.paginationStore.sortOrder() === -1 ? 'DESC' : 'ASC',
      };
    },
    loader: async ({ params }) => {
      const { productor, limit, page, sort, sort_direction } = params;
      const pagination: ApiQueryParams = { limit, page, sort, sort_direction };
      return this._preguntasService.getPreguntasPendientesProductor(productor, pagination);
    },
  });

  public preguntas = computed(() => this.preguntasResource.value()?.data);

  public totalPreguntas = computed<number>(() => {
    return this.preguntasResource.value()?.meta.total || 0;
  });

  ngOnInit(): void {
    this.paginationStore.resetPagination();
  }

  public async responderPregunta(nuevaRespuesta: RespuestaPost) {
    const productor = this.productor();
    const { producto, id_pregunta, contenido } = nuevaRespuesta;
    try {
      await this._preguntasService.responderPregunta(productor, producto, id_pregunta, contenido);
      this.preguntasResource.reload();
    } catch (error: any) {
      const mensaje = error.error ? error.error.message : error.message;
      this._dialogService.addError(mensaje);
    }
  }
}
