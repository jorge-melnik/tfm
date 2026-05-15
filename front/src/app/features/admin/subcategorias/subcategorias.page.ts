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

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: () => this._categoriaService.getAll(),
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

  protected async createSubcategoria(data: Partial<Subcategoria>): Promise<void> {
    if (!data.id_categoria) return;
    this.pathParams = { id_categoria: data.id_categoria };
    const subcategoria = await super.create(data);

    if (!subcategoria) return;
    if (!data.id_etiquetas) return;

    await this._subcategoriaService.setEtiquetas(
      data.id_categoria,
      subcategoria.id_subcategoria,
      data.id_etiquetas,
    );
  }

  protected async updateSubcategoria(data: Partial<Subcategoria>): Promise<void> {
    if (!data.id_categoria) return;
    if (!data.id_subcategoria) return;
    this.pathParams = { id_categoria: data.id_categoria };
    await super.update(data);
    if (!data.id_etiquetas) return;
    await this._subcategoriaService.setEtiquetas(
      data.id_categoria,
      data.id_subcategoria,
      data.id_etiquetas,
    );
  }

  protected override async remove(data: Subcategoria): Promise<void> {
    if (!data.id_categoria) return;
    this.pathParams = { id_categoria: data.id_categoria };
    await super.remove(data);
  }
}
