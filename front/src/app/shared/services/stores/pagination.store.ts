import { computed, Service, signal } from '@angular/core';
import { DataViewPageEvent } from 'primeng/dataview';
import { PaginatorState } from 'primeng/paginator';
const defaultItemsPorPagina = 4;
@Service()
export class PaginationStore {
  private readonly _page = signal<number>(1);
  private readonly _limit = signal<number>(defaultItemsPorPagina);
  private readonly _sortOrder = signal<1 | -1 | 0>(0);
  private readonly _sortField = signal<string>('');
  private readonly _rowsPerPageOptions = signal<number[]>([2, 4, 6, 8, 12]);

  /** Guardamos el orden seleccionado. Ejemplo precio mayor a menor */
  private readonly _sortKey = signal<string>('');

  public page = this._page.asReadonly(); //Esto es para que no vayan a cambiar la referencia de la signal.
  public limit = this._limit.asReadonly();
  public readonly first = computed(() => ((this._page() || 1) - 1) * this.limit());
  public sortKey = this._sortKey.asReadonly();
  public sortOrder = this._sortOrder.asReadonly();
  public sortField = this._sortField.asReadonly();
  public rowsPerPageOptions = this._rowsPerPageOptions.asReadonly();

  public resetPagination() {
    this._limit.set(defaultItemsPorPagina);
    this._sortField.set('');
    this._sortOrder.set(0);
    this._page.set(1);
  }
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

  onPageChange(event: PaginatorState | DataViewPageEvent) {
    // Aseguramos valores por defecto en caso de que event.first o event.rows sean undefined (común en PaginatorState)
    const rows = event.rows ?? defaultItemsPorPagina;
    const first = event.first ?? 1;

    console.log('PAGE CHANGE');
    this.setLimit(rows);

    const nuevaPagina = Math.floor(first / rows) + 1;
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
