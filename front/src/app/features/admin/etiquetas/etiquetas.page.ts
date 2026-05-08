import { Component, inject, resource } from '@angular/core';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { AdminTable } from '@shared/components/admin-table/admin.table';
import { TableColumn } from '@shared/types/util';

@Component({
  selector: 'app-etiquetas',
  imports: [AdminTable],
  templateUrl: './etiquetas.page.html',
  styleUrl: './etiquetas.page.css',
})
export class EtiquetasPage {
  private readonly _etiquetaService = inject(EtiquetasService);

  public columns: TableColumn[] = [
    {
      key: 'id_etiqueta',
      keyTitle: 'Id',
      type: 'number',
    },
    {
      key: 'nombre',
      keyTitle: 'Nombre',
      type: 'text',
    },
    {
      key: 'slug_etiqueta',
      keyTitle: 'Slug',
      type: 'text',
    },
    {
      key: 'color',
      keyTitle: 'Color',
      type: 'color',
    },
    {
      key: 'imagen',
      keyTitle: 'Imagen',
      type: 'text',
    },
  ];

  public etiquetasResource = resource({
    defaultValue: [],
    loader: async () => {
      try {
        return await this._etiquetaService.getAll();
      } catch (error: any) {
        console.error(error);
      }
      return [];
    },
  });
}
