import { Component, inject, resource } from '@angular/core';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { AdminTable } from '@shared/components/admin-table/admin.table';

@Component({
  selector: 'app-etiquetas',
  imports: [AdminTable],
  templateUrl: './etiquetas.page.html',
  styleUrl: './etiquetas.page.css',
})
export class EtiquetasPage {
  private readonly _etiquetaService = inject(EtiquetasService);

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
