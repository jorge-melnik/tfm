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

@Component({
  selector: 'app-categorias',
  imports: [
    TableModule,
    ProgressSpinnerModule,
    TitleCasePipe,
    DatePipe,
    TableModule,
    CommonModule,
    IconFieldModule,
    InputIcon,
    FormsModule,
    InputText,
    Button,
    RouterLink,
  ],
  templateUrl: './categorias.page.html',
  styleUrl: './categorias.page.css',
})
export class CategoriasPage {
  private readonly _categoriasService = inject(CategoriasService);

  public excludeColumns: string[] = [];

  public searchValue = signal<string | null>(null);

  columns = computed(() => {
    const data = this.categoriasResource.value();
    const firstItem = data[0];
    if (!firstItem) return [];

    return Object.keys(firstItem)
      .filter((key) => !this.excludeColumns.includes(key)) //La key no está en las excluidas
      .map((key) => ({
        key,
        keyTitle: this.formatHeader(key),
      }));
  });

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

  private formatHeader(key: string): string {
    if (key.startsWith('id_')) return '#';
    if (key.startsWith('slug_')) return 'Slug';
    return key.replace(/_/g, ' '); ///reemplazamos guion bajo por espacio
  }

  clear(dt: Table) {
    this.searchValue.set(null);
    dt.reset();
  }
}
