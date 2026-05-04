import { Component, inject, resource } from '@angular/core';
import { CategoriasService } from '@shared/services/categorias.service';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdminTable } from '@shared/components/admin-table/admin.table';

@Component({
  selector: 'app-categorias',
  imports: [TableModule, ProgressSpinnerModule, AdminTable],
  templateUrl: './categorias.page.html',
  styleUrl: './categorias.page.css',
})
export class CategoriasPage {
  private readonly _categoriasService = inject(CategoriasService);

  public categoriasResource = resource({
    defaultValue: [],
    loader: () => this._categoriasService.getAll(),
  });
}
