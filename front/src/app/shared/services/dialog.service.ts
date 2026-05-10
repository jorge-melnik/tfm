import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly _confirmationService = inject(ConfirmationService);
  private readonly _messageService = inject(MessageService);

  async pedirConfirmarBorrado(
    entidad: string,
    nombre: string,
    pronombre: string = 'la',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this._confirmationService.confirm({
        header: 'Confirmar eliminación',
        message: `¿Estás seguro que quieres borrar ${pronombre} ${entidad} "${nombre}"?`,
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-danger',
        rejectButtonStyleClass: 'p-button-secondary p-button-text',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
  async pedirConfirmarActualizar(
    entidad: string,
    nombre: string,
    pronombre: string = 'la',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this._confirmationService.confirm({
        header: 'Confirmar Actualización',
        message: `¿Estás seguro que quieres guardar los cambios en ${pronombre} ${entidad} "${nombre}"?`,
        icon: 'pi pi-info-circle',
        acceptLabel: 'Actualizar',
        acceptButtonStyleClass: 'p-button-primary',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'p-button-secondary p-button-text',

        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }

  async pedirConfirmarCrear(
    entidad: string,
    nombre: string,
    pronombre: string = 'la',
  ): Promise<boolean> {
    return new Promise((resolve) => {
      this._confirmationService.confirm({
        header: 'Confirmar Creación',
        message: `¿Estás seguro que quieres crear ${pronombre} ${entidad} "${nombre}"?`,
        icon: 'pi pi-info-circle',
        acceptLabel: 'Crear',
        acceptButtonStyleClass: 'p-button-primary',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'p-button-secondary p-button-text',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
  async addSuccess(message: string) {
    this._messageService.add({
      severity: 'success',
      summary: 'Listo.',
      detail: message,
    });
  }
  async addInfo(message: string) {
    this._messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }
  async addWarn(message: string) {
    this._messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
    });
  }

  async addError(message: string) {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
