import { Component, inject, resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriasService } from '@shared/services/categorias.service';
import { DialogService } from '@shared/services/dialog.service';
import { EtiquetasService } from '@shared/services/etiquetas.service';
import { ProductosService } from '@shared/services/productos.service';
import { UserStore } from '@shared/services/stores/user.store';
import { SubcategoriasService } from '@shared/services/subcategorias.service';
import { Categoria, Subcategoria } from '@shared/types/categoria';
import { Producto } from '@shared/types/producto';
import { TableColumn } from '@shared/types/util';
import { Table, EditableRow, CellEditor } from 'primeng/table';
import { environment } from '@env/environment';
import { ButtonDirective } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-productoos',
  imports: [FormsModule, Table, EditableRow, CellEditor, ButtonDirective, ContextMenuModule],
  templateUrl: './productos.page.html',

  styleUrl: './productos.page.css',
})
export class ProductosPage {
  private readonly _dialogService = inject(DialogService);
  private readonly _productosService = inject(ProductosService);
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetaService = inject(EtiquetasService);
  private readonly _userStore = inject(UserStore);

  public cdnUrl = environment.cdnUrl;

  public items!: MenuItem[];

  public columns: TableColumn[] = [
    {
      key: 'id_producto',
      keyTitle: 'Id',
      type: 'text',
    },
    {
      key: 'nombre',
      keyTitle: 'Nombre',
      type: 'text',
    },
    {
      key: 'slug_productoo',
      keyTitle: 'Slug',
      type: 'text',
    },
    {
      key: 'descripcion',
      keyTitle: 'Descripción',
      type: 'text',
    },
    {
      key: 'id_categoria',
      keyTitle: 'Categoría',
      type: 'categoria',
    },
    {
      key: 'id_subcategoria',
      keyTitle: 'Subcategoria',
      type: 'subcategoria',
    },
    {
      key: 'id_etiquetas',
      keyTitle: 'Etiquetas',
      type: 'etiquetas',
    },
  ];

  public productosResource = resource({
    defaultValue: [] as Producto[],
    loader: async () => {
      const user = this._userStore.user();
      if (!user) throw new Error('Usuario no autenticado');
      const productos = (
        await this._productosService.getBy({
          queryParams: {
            id_productor: user.id_usuario,
          },
        })
      ).data;
      return productos;
    },
  });

  public categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: () => this._categoriaService.getAll(),
  });

  public subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    loader: () => this._subcategoriaService.getAll(),
  });

  public etiquetasResource = resource({
    defaultValue: [],
    loader: async () => {
      const etiquetas = await this._etiquetaService.getAll();
      return etiquetas;
    },
  });

  public productoSeleccionado = signal<Producto | null>(null);

  onRowEditInit(producto: Producto) {
    this.productoSeleccionado.set({ ...producto });
  }

  onRowEditSave(producto: Producto) {}

  onRowEditCancel(producto: Producto, index: number) {}

  getSeverityLabel(productoo: Producto): string {
    return 'INSTOCK';
  }
}
