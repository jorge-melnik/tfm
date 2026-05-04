import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { RefreshButton } from '../buttons/refresh/refresh.button';
import { CreateButton } from '../buttons/create/create.button';

@Component({
  selector: 'app-admin-table',
  imports: [
    TitleCasePipe,
    DatePipe,
    TableModule,
    CommonModule,
    IconFieldModule,
    InputIcon,
    FormsModule,
    InputText,
    RefreshButton,
    CreateButton,
  ],
  templateUrl: './admin.table.html',
  styleUrl: './admin.table.css',
})
export class AdminTable {
  public data = input.required<any[]>();
  public title = input<string | undefined>();

  public paginator = input<boolean>(false);
  public isLoading = input.required<boolean>();

  public excludeColumns = input<string[]>([]); //Columnas a ignorar

  public searchValue = signal<string | null>(null);

  // Eventos para las acciones
  public update = output<any>();
  public remove = output<any>();

  public refresh = output<void>();

  constructor() {}

  columns = computed(() => {
    const data = this.data();
    const firstItem = data[0];
    if (!firstItem) return [];

    return Object.keys(firstItem)
      .filter((key) => !this.excludeColumns().includes(key)) //La key no está en las excluidas
      .map((key) => ({
        key,
        keyTitle: this.formatHeader(key),
      }));
  });

  globalFilterFields = computed(() => {
    return this.columns().map((c) => c.key);
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
