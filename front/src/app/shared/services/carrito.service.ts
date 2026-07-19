import { computed, inject, resource, Service } from '@angular/core';
import { environment } from '@env/environment';
import { UserStore } from './stores/user.store';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ItemCarrito, ItemCarritoVerbose } from '@shared/types/item-carrito';
import { DialogService } from './dialog.service';

@Service()
export class CarritoService {
  private readonly _usuarioStore = inject(UserStore);
  private readonly _http = inject(HttpClient);
  private readonly _dialog = inject(DialogService);

  private _baseUrl = computed<string | undefined>(() => {
    const usuario = this._usuarioStore.user();
    if (!usuario) return;
    return `${environment.apiUrl}/consumidores/${usuario.id_usuario}/carrito`;
  });

  public readonly items = resource<ItemCarritoVerbose[], { url: string | undefined }>({
    defaultValue: [] as ItemCarritoVerbose[],
    params: () => {
      return { url: this._baseUrl() };
    },
    loader: async ({ params }) => {
      if (!params.url) return [];
      try {
        const res = await firstValueFrom(this._http.get<ItemCarritoVerbose[]>(params.url));
        return res;
      } catch (error: any) {
        this._dialog.addError(error.error.message);
        return [];
      }
    },
  });

  public readonly cantidadItems = computed(() =>
    this.items.value().reduce((total, item) => total + item.cantidad, 0),
  );

  public readonly totalCarrito = computed(() =>
    this.items.value().reduce((total, item) => total + item.subtotal, 0),
  );

  public async addItem(item: ItemCarrito) {
    const baseUrl = this._baseUrl();
    if (!baseUrl) throw new Error('No hay usuario consumidor autenticado.');
    const url = `${baseUrl}/productos`;
    await firstValueFrom(this._http.post(url, item));
    this.items.reload();
  }

  public async updateItem(item: ItemCarrito) {
    const baseUrl = this._baseUrl();
    if (!baseUrl) throw new Error('No hay usuario consumidor autenticado.');
    const url = `${baseUrl}/productos/${item.id_producto}`;
    await firstValueFrom(this._http.put(url, item));
    this.items.reload();
  }

  public async removeItem(item: ItemCarrito) {
    const baseUrl = this._baseUrl();
    if (!baseUrl) throw new Error('No hay usuario consumidor autenticado.');
    const url = `${baseUrl}/productos/${item.id_producto}`;
    await firstValueFrom(this._http.delete(url));
    this.items.reload();
  }
}
