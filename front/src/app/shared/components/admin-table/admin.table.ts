import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { Component, computed, input, model, output, signal } from '@angular/core';
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
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { Select } from 'primeng/select';

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
    Select,
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
  public categorias = input<Categoria[]>();
  public subcategorias = input<Subcategoria[]>();
  public etiquetas = input<Categoria[]>();

  public searchValue = signal<string | null>(null);
  public newItem = signal<any>({});

  // Eventos para las acciones
  public create = output<any>();
  public update = output<any>();
  public remove = output<any>();
  public refresh = output<void>();
  public categoriaSeleccionada = model<Categoria | null>(null);
  public subcategoriaSeleccionada = model<Subcategoria | null>(null);

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
    this.remove.emit(data);
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
