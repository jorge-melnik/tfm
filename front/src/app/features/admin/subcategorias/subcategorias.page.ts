import { Component, inject, model, resource } from '@angular/core';
import { CategoriasService } from '@shared/services/categorias.service';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AdminTable } from '@shared/components/admin-table/admin.table';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { CommonModule } from '@angular/common';
import { TableColumn } from '@shared/types/util';
import { AdminBasePage } from '../admin-base.page';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Etiqueta } from '@shared/types/etiqueta';
import { EtiquetasService } from '@shared/services/etiquetas.service';

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
  templateUrl: './subcategorias.page.html',
  styleUrl: './subcategorias.page.css',
})
export class SubcategoriasPage extends AdminBasePage<Subcategoria> {
  protected override idKey: keyof Subcategoria = 'id_subcategoria';
  public override entidadName: string = 'etiqueta';

  protected _dataService = inject(SubcategoriasService);
  public columns: TableColumn[] = [
    {
      key: 'id_subcategoria',
      keyTitle: 'Id',
      type: 'number',
    },
    {
      key: 'id_categoria',
      keyTitle: 'Categoria',
      type: 'categoria',
    },
    {
      key: 'nombre',
      keyTitle: 'Nombre',
      type: 'text',
    },
    {
      key: 'activo',
      keyTitle: 'Activo',
      type: 'boolean',
    },
    {
      key: 'id_etiquetas',
      keyTitle: 'Etiquetas',
      type: 'etiquetas',
    },
    //Etos serían los de la categoría.
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
  ];

  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetaService = inject(EtiquetasService);

  public categoriaSeleccionada = model<Categoria | null>(null);
  public subcategoriaSeleccionada = model<Subcategoria | null>(null);

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: () => this._categoriaService.getAll(),
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    loader: async () => {
      const categoria = this.categoriaSeleccionada();
      if (!categoria) return [];
      return this._subcategoriaService.getAll({ id_categoria: categoria.id_categoria });
    },
  });

  public etiquetasResource = resource({
    defaultValue: [],
    loader: async () => {
      const etiquetas = await this._etiquetaService.getAll();
      return etiquetas;
    },
  });

  private readonly _http = inject(HttpClient);
  //
  protected override async getAll(): Promise<Subcategoria[]> {
    const url = `${environment.apiUrl}/admin/subcategorias`;
    return firstValueFrom(this._http.get<Subcategoria[]>(url));
  }

  protected override async create(data: Partial<Subcategoria>): Promise<void> {
    if (!data.id_categoria) return;
    this.pathParams = { id_categoria: data.id_categoria };
    await super.create(data);
    //TODO: Agregar etiquetas
  }

  protected override async update(data: Partial<Subcategoria>): Promise<void> {
    if (!data.id_categoria) return;
    this.pathParams = { id_categoria: data.id_categoria };
    await super.update(data);
    //TODO: Quitar etiquetas que ya no están.
    //TODO: Agregar etiquetas que no estaban.
  }

  protected override async remove(data: Subcategoria): Promise<void> {
    if (!data.id_categoria) return;
    this.pathParams = { id_categoria: data.id_categoria };
    await super.remove(data);
  }
}
