import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { AdminTable } from '@shared/components/admin-table/admin.table';
import { TableColumn } from '@shared/types/util';
import { Etiqueta } from '@shared/types/etiqueta';
import { AdminBasePage } from '../admin-base.page';

@Component({
  selector: 'app-etiquetas',
  imports: [AdminTable],
  templateUrl: './etiquetas.page.html',

  styleUrl: './etiquetas.page.css',
})
export class EtiquetasPage extends AdminBasePage<Etiqueta> {
  protected override idKey: keyof Etiqueta = 'slug_etiqueta';
  public override entidadName: string = 'etiqueta';

  protected _dataService = inject(EtiquetasService);

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
      type: 'link',
    },
  ];
}
