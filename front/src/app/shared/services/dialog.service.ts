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
        acceptButtonStyleClass: 'button pButton-danger',
        rejectButtonStyleClass: 'button pButton-secondary button pButton-text',
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
        acceptButtonStyleClass: 'button pButton-primary',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'button pButton-secondary button pButton-text',

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
        acceptButtonStyleClass: 'button pButton-primary',
        rejectLabel: 'Cancelar',
        rejectButtonStyleClass: 'button pButton-secondary button pButton-text',
        accept: () => resolve(true),
        reject: () => resolve(false),
      });
    });
  }
  addSuccess(message: string) {
    this._messageService.add({
      severity: 'success',
      summary: 'Listo.',
      detail: message,
    });
  }
  addInfo(message: string) {
    this._messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }
  addWarn(message: string) {
    this._messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: message,
    });
  }

  addError(message: string) {
    this._messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
