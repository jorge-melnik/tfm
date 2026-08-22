import { computed, inject, resource, Service } from '@angular/core';
import { environment } from '@env/environment';
import { UserStore } from './stores/user.store';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Carrito, ItemCarrito, ItemCarritoVerbose } from '@shared/types/item-carrito';
import { DialogService } from './dialog.service';

@Service()
export class CarritoService {
  private readonly _usuarioStore = inject(UserStore);
  private readonly _http = inject(HttpClient);
  private readonly _dialog = inject(DialogService);

  private _baseUrl = computed<string>(() => {
    const usuario = this._usuarioStore.user();
    if (!usuario) return 'FIXME retornar url de not found o algo?';
    return `${environment.apiUrl}/consumidores/${usuario.username}/carrito`;
  });

  private readonly productosResource = resource({
    defaultValue: [] as ItemCarritoVerbose[],
    params: () => {
      const url = this._baseUrl();
      if (!url) return undefined;
      return { url };
    },
    loader: async ({ params }) => {
      return firstValueFrom(this._http.get<ItemCarritoVerbose[]>(params.url + '/productos'));
    },
  });

  public readonly productos = computed(() => {
    if (!this.productosResource.hasValue()) return [];
    return this.productosResource.value();
  });

  public readonly carritoResource = resource({
    defaultValue: {
      id_consumidor: 'string',
      cantidad_items: 0,
      cantidad_productos_distintos: 0,
      total: '0',
    },
    params: () => {
      const url = this._baseUrl();
      if (!url) return undefined;
      return { url };
    },
    loader: async ({ params }) => {
      const { url } = params;
      const res = await firstValueFrom(this._http.get<Carrito>(url));
      return res;
    },
  });

  public readonly carrito = computed(() => {
    if (!this.carritoResource.hasValue()) return undefined;
    return this.carritoResource.value();
  });

  public readonly cantidadItems = computed(() => {
    const carrito = this.carrito();
    if (!carrito) return 0;
    return carrito.cantidad_items;
  });

  public readonly totalCarrito = computed(() => {
    const carrito = this.carrito();
    if (!carrito) return 0;
    return carrito.total;
  });

  public async addItem(item: ItemCarrito) {
    const baseUrl = this._baseUrl();
    if (!baseUrl) throw new Error('No hay usuario consumidor autenticado.');
    const url = `${baseUrl}/productos`;
    await firstValueFrom(this._http.post(url, item));
    this.recargarCarrito();
  }

  public async updateItem(item: ItemCarrito) {
    const baseUrl = this._baseUrl();
    if (!baseUrl) throw new Error('No hay usuario consumidor autenticado.');
    const url = `${baseUrl}/productos/${item.id_producto}`;
    await firstValueFrom(this._http.put(url, item));
    this.recargarCarrito();
  }

  public async removeItem(item: ItemCarrito) {
    const baseUrl = this._baseUrl();
    if (!baseUrl) throw new Error('No hay usuario consumidor autenticado.');
    const url = `${baseUrl}/productos/${item.id_producto}`;
    await firstValueFrom(this._http.delete(url));
    this.recargarCarrito();
  }

  public recargarCarrito() {
    this.productosResource.reload();
    this.carritoResource.reload();
  }
}
