import { computed, Service, signal } from '@angular/core';
import { DataViewPageEvent } from 'primeng/dataview';

@Service()
export class PaginationStore {
  private readonly _page = signal<number>(1);
  private readonly _limit = signal<number>(4);
  private readonly _sortOrder = signal<1 | -1 | 0>(0);
  private readonly _sortField = signal<string>('');
  private readonly _rowsPerPageOptions = signal<number[]>([2, 4, 8, 16]);

  /** Guardamos el orden seleccionado. Ejemplo precio mayor a menor */
  private readonly _sortKey = signal<string>('');

  public page = this._page.asReadonly(); //Esto es para que no vayan a cambiar la referencia de la signal.
  public limit = this._limit.asReadonly();
  public readonly first = computed(() => ((this._page() || 1) - 1) * this.limit());
  public sortKey = this._sortKey.asReadonly();
  public sortOrder = this._sortOrder.asReadonly();
  public sortField = this._sortField.asReadonly();
  public rowsPerPageOptions = this._rowsPerPageOptions.asReadonly();

  public setLimit(nuevoLimit: number) {
    this._limit.set(nuevoLimit);
  }

  public setPage(nuevaPage: number) {
    this._page.set(nuevaPage);
  }

  public setSortOrder(order: 1 | -1 | 0) {
    this._sortOrder.set(order);
  }

  public setSortField(field: string) {
    this._sortField.set(field);
  }

  onPageChange(event: DataViewPageEvent) {
    // Propiedades disponibles en 'event':
    // event.first -> Índice del primer elemento (ej: 0, 6, 12)
    // event.rows  -> Cantidad de elementos por página (ej: 6, 12, 24)
    console.log('PAGE CHANGE');
    this.setLimit(event.rows);
    const nuevaPagina = event.first / event.rows + 1;
    this.setPage(nuevaPagina);
  }

  public onSortChange(value: string | null) {
    // Resetear a la página 1
    this.setPage(1);

    // Si se limpia la selección
    if (!value) {
      this.setSortField('');
      this.setSortOrder(1);
      return;
    }

    // Lógica de despiece para ASC / DESC con '!'
    if (value.startsWith('!')) {
      this.setSortOrder(-1); // DESC
      this.setSortField(value.substring(1));
    } else {
      this.setSortOrder(1); // ASC
      this.setSortField(value);
    }
  }
}
