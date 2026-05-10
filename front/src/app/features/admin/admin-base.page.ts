import { inject, resource } from '@angular/core';
import { TableColumn } from '@shared/types/util';
import { DialogService } from '@shared/services/dialog.service';
import { CrudPage, CrudServiceInterface } from '@shared/types/crud-base';
import { PathParams } from '@shared/types/api.types';

export abstract class AdminBasePage<T> extends CrudPage<T> {
  protected readonly _dialogService = inject(DialogService);
  protected abstract _dataService: CrudServiceInterface<T>;
  protected pathParams?: PathParams = {};
  protected abstract idKey: keyof T;

  public abstract columns: TableColumn[];
  public abstract entidadName: string;

  public resource = resource({
    defaultValue: [] as T[],
    loader: () => this.getAll(),
  });

  protected override async getAll(): Promise<T[]> {
    return this._dataService.getAll(this.pathParams);
  }

  protected override async create(data: Partial<T>): Promise<void> {
    const nombre = (data as any).nombre || 'nuevo';
    const confirmado = await this._dialogService.pedirConfirmarCrear(this.entidadName, nombre);
    if (!confirmado) return;
    await this._runTryCatch(() => this._dataService.create(data));
  }

  protected override async update(data: Partial<T>): Promise<void> {
    const id = data[this.idKey] as any;
    const nombre = (data as any).nombre || 'registro';
    const confirmado = await this._dialogService.pedirConfirmarActualizar(this.entidadName, nombre);
    if (!confirmado) return;
    await this._runTryCatch(() => this._dataService.update(id, data, this.pathParams));
  }

  protected override async remove(data: T): Promise<void> {
    const id = data[this.idKey] as any;
    const nombre = (data as any).nombre || 'registro';
    const confirmado = await this._dialogService.pedirConfirmarBorrado(this.entidadName, nombre);
    if (!confirmado) return;
    await this._runTryCatch(() => this._dataService.remove(id));
  }

  private async _runTryCatch(action: () => Promise<any>) {
    try {
      await action();
      this.resource.reload();
    } catch (error: any) {
      this._dialogService.addError(error.message);
    }
  }
}
