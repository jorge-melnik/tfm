import { Component, computed, inject, OnInit, resource, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SelectButton } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '@shared/services/productos.service';
import { Producto } from '@shared/types/producto';
import { environment } from '@env/environment';
import { ProductoCard } from '@shared/components/producto-card/producto.card';
import { SelectItem } from 'primeng/select';
interface SortOption {
  label: string;
  value: string;
}
import { SelectModule } from 'primeng/select';
@Component({
  selector: 'app-home-consumidor',
  imports: [
    ButtonModule,
    DataViewModule,
    TagModule,
    SelectButton,
    FormsModule,
    ProductoCard,
    SelectModule,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _productoService = inject(ProductosService);

  public cdnUrl = environment.cdnUrl;

  public productosResource = resource({
    defaultValue: [] as Producto[],
    loader: () => this._productoService.getAll(),
  });

  // Señales para filtros
  public filtroBusqueda = signal<string>('');
  public layout = signal<'grid' | 'list'>('grid'); // Estado del diseño (tarjeta o lista)

  public sortKey = signal<string>('');
  public sortOrder = signal<number>(0);
  public sortField = signal<string>('');
  public sortOptions!: SortOption[];

  // Productos filtrados reactivamente
  public productosFiltrados = computed(() => {
    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    const productos = this.productosResource.value();
    if (!this.productosResource.hasValue()) return [];
    if (!busqueda) return productos;
    return productos.filter((p) => p.nombre.toLowerCase().includes(busqueda));
  });

  ngOnInit() {
    this.sortOptions = [
      { label: 'Menor a mayor precio', value: 'precio' },
      { label: 'Mayor a menor precio', value: '!precio' },
    ];
  }

  public agregarAlCarrito(producto: any) {
    console.log('Agregado al carrito:', producto.nombre);
  }

  public onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder.set(-1);
      this.sortField.set(value.substring(1, value.length));
      this.sortKey.set(value);
    } else {
      this.sortOrder.set(1);
      this.sortField.set(value);
      this.sortKey.set(value);
    }
  }
}
