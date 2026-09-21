import { computed, inject, resource, Service, signal } from '@angular/core';
import { CategoriasService } from '../categorias.service';
import { SubcategoriasService } from '../subcategorias.service';
import { EtiquetasService } from '../etiquetas.service';
import { DialogService } from '../dialog.service';
import { Etiqueta } from '@shared/types/etiqueta';
import { Categoria, Subcategoria } from '@shared/types/categoria';

@Service()
export class EtiquetasStore {
  private readonly _categoriaService = inject(CategoriasService);
  private readonly _subcategoriaService = inject(SubcategoriasService);
  private readonly _etiquetasService = inject(EtiquetasService);
  private readonly _dialogService = inject(DialogService);

  private readonly _categoriaSeleccionada = signal<string | null>(null);
  private readonly _subcategoriaSeleccionada = signal<string | null>(null);
  private readonly _etiquetasSeleccionadas = signal<string[]>([]);

  public categoriaSeleccionada = this._categoriaSeleccionada.asReadonly();
  public subcategoriaSeleccionada = this._subcategoriaSeleccionada.asReadonly();
  public etiquetasSeleccionadas = this._etiquetasSeleccionadas.asReadonly();

  public categorias = computed<Categoria[]>(() => {
    if (!this._categoriasResource.hasValue()) return [];
    return this._categoriasResource.value();
  });

  public subcategorias = computed<Subcategoria[]>(() => {
    if (!this._subcategoriasResource.hasValue()) return [];
    return this._subcategoriasResource.value();
  });

  public etiquetas = computed<Etiqueta[]>(() => {
    if (!this._etiquetasResource.hasValue()) return [];
    return this._etiquetasResource.value();
  });

  private _categoriasResource = resource({
    defaultValue: [] as Categoria[],
    loader: async () => {
      try {
        return this._categoriaService.getAll();
      } catch (error: any) {
        //FIXME: No corresponde try catch aquí... osi ?
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
        return [] as Categoria[];
      }
    },
  });

  private _subcategoriasResource = resource({
    defaultValue: [] as Subcategoria[],
    params: () => ({ categoria: this.categoriaSeleccionada() }),
    loader: async ({ params }) => {
      try {
        const { categoria } = params;
        if (!categoria) return this._subcategoriaService.getAll();
        return this._categoriaService.getSubcategorias(categoria);
      } catch (error: any) {
        //FIXME: Sacar try catch?
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
        return [] as Subcategoria[];
      }
    },
  });

  private _etiquetasResource = resource({
    defaultValue: [] as Etiqueta[],
    params: () => ({
      categoria: this.categoriaSeleccionada(),
      subcategoria: this.subcategoriaSeleccionada(),
    }),
    loader: async ({ params }) => {
      try {
        const { categoria, subcategoria } = params;

        if (subcategoria) return this._subcategoriaService.getEtiquetas(subcategoria);
        if (categoria) return this._categoriaService.getEtiquetas(categoria);

        //No hay ninguno de los slug
        return this._etiquetasService.getAll();
      } catch (error: any) {
        //FIXME: Sacar try catch?
        const mensaje = error.error ? error.error.message : error.message;
        this._dialogService.addError(mensaje);
        return [] as Etiqueta[];
      }
    },
  });

  public setCategoriaSeleccionada(categoria: string | null) {
    this._categoriaSeleccionada.set(categoria);
  }
  public setSubcategoriaSeleccionada(subcategoria: string | null) {
    this._subcategoriaSeleccionada.set(subcategoria);
  }
  public setEtiquetasSeleccionadas(etiquetas: string[]) {
    this._etiquetasSeleccionadas.set(etiquetas);
  }
  public addEtiquetaSeleccionada(etiqueta: string) {
    const actuales = this.etiquetasSeleccionadas();
    if (actuales.includes(etiqueta)) return;
    this._etiquetasSeleccionadas.set([...actuales, etiqueta]);
  }
  public removeEtiquetaSeleccionada(etiqueta: string) {
    const actuales = this.etiquetasSeleccionadas();
    if (!actuales.includes(etiqueta)) return;
    const nuevas = actuales.filter((e) => e !== etiqueta);
    this._etiquetasSeleccionadas.set(nuevas);
  }
}
