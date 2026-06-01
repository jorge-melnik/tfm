import { Component, inject } from '@angular/core';
import { CategoriasService } from '@shared/services/admin/categorias.service';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdminTable } from '@shared/components/admin-table/admin.table';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { TableColumn } from '@shared/types/util';
import { AdminBasePage } from '../admin-base.page';
import { Categoria } from '@shared/types/categoria';

@Component({
  selector: 'app-categorias',
  imports: [
    TableModule,
    ProgressSpinnerModule,
    TableModule,
    CommonModule,
    IconFieldModule,
    FormsModule,
    AdminTable,
  ],
  templateUrl: './categorias.page.html',
  styleUrl: './categorias.page.css',
})
export class CategoriasPage extends AdminBasePage<Categoria> {
  protected override idKey: keyof Categoria = 'id_categoria';
  public override entidadName: string = 'etiqueta';

  protected _dataService = inject(CategoriasService);
  public columns: TableColumn[] = [
    {
      key: 'id_categoria',
      keyTitle: 'Id',
      type: 'number',
    },
    {
      key: 'nombre',
      keyTitle: 'Nombre',
      type: 'text',
    },
    {
      key: 'slug_categoria',
      keyTitle: 'Slug',
      type: 'text',
    },
    {
      key: 'descripcion',
      keyTitle: 'Descripcion',
      type: 'text',
    },
    {
      key: 'icono',
      keyTitle: 'Icono',
      type: 'icono',
    },
    {
      key: 'color',
      keyTitle: 'Color',
      type: 'color',
    },
    {
      key: 'activo',
      keyTitle: 'Activo',
      type: 'boolean',
    },
  ];
}
