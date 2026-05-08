import { Component, computed, inject, resource, signal } from '@angular/core';
import { CategoriasService } from '@shared/services/categorias.service';
import { Table, TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdminTable } from '@shared/components/admin-table/admin.table';
import { Button } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { InputIcon } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Categoria } from '@shared/types/categoria';
import { SelectItem } from 'primeng/select';
import { TableColumn } from '@shared/types/util';

@Component({
  selector: 'app-categorias',
  imports: [
    TableModule,
    ProgressSpinnerModule,
    TableModule,
    CommonModule,
    IconFieldModule,
    InputIcon,
    FormsModule,
    InputText,
    Button,
    RouterLink,
    AdminTable,
  ],
  templateUrl: './categorias.page.html',
  styleUrl: './categorias.page.css',
})
export class CategoriasPage {
  private readonly _categoriasService = inject(CategoriasService);

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

  public categoriasResource = resource({
    defaultValue: [],
    loader: async () => {
      try {
        return await this._categoriasService.getAll();
      } catch (error: any) {
        console.error(error);
      }
      return [];
    },
  });
}
