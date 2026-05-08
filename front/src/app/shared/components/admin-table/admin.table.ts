import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableColumn } from '@shared/types/util';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ColorPickerModule } from 'primeng/colorpicker';

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
    Button,
    FormsModule,
    ProgressSpinnerModule,
    ToggleSwitchModule,
    ColorPickerModule,
  ],
  templateUrl: './admin.table.html',
  styleUrl: './admin.table.css',
})
export class AdminTable {
  public data = input.required<any[]>();
  public title = input<string | undefined>();

  public paginator = input<boolean>(false);
  public isLoading = input.required<boolean>();
  public id = input.required<string>();
  public columns = input.required<TableColumn[]>();
  public editableColumns = input<string[]>([]); //Columnas editables

  public searchValue = signal<string | null>(null);
  public newItem = signal<any>({});

  // Eventos para las acciones
  public create = output<any>();
  public update = output<string | number>();
  public remove = output<string | number>();
  public refresh = output<void>();

  public creating = signal<boolean>(false);

  constructor() {}

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

  editInit(data: any) {
    console.log('edit init.', { data });
    this.creating.set(false);
  }

  editSave(data: any) {
    console.log('edit save.', { data });
    this.creating.set(false);
    this.update.emit(data);
  }

  removeInit(data: any) {
    console.log('remove init.', { data });
    this.creating.set(false);
  }

  editCancel(data: any, index: number) {
    console.log('edit Cancelado.');
    this.creating.set(false);
  }

  createInit() {
    console.log('Create init');

    this.creating.set(true);
  }

  createSave() {
    const data = this.newItem();
    this.create.emit(data);
    console.log({ data });
    this.newItem.set({});
    this.creating.set(false);
  }

  createCancel() {
    this.creating.set(false);
  }
}
