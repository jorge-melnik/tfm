import { Component, inject, input, resource } from '@angular/core';
import { SubcategoriasService } from '@shared/services/subcategorias.service';

@Component({
  selector: 'app-subcategorias',
  imports: [],
  templateUrl: './subcategorias.page.html',
  styleUrl: './subcategorias.page.css',
})
export class SubcategoriasPage {
  public id_categoria = input.required<number>();

  private readonly _categoriasService = inject(SubcategoriasService);

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
