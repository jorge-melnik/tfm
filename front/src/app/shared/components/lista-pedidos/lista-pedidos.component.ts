import { Component, input, output, model, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { VistaPedidoComponent } from '../vista-pedido/vista-pedido.component';
import { EstadoPedido, EstadoPedidoType, Pedido } from '@shared/types/pedido';
import { PaginationStore } from '@shared/services/stores/pagination.store';
import { Select } from 'primeng/select';

export interface OpcionEstado {
  label: string;
  value: string | null;
}

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    SelectButtonModule,
    VistaPedidoComponent,
    Select,
  ],
  templateUrl: './lista-pedidos.component.html',
})
export class ListaPedidosComponent implements OnInit {
  public readonly paginationStore = inject(PaginationStore);

  public titulo = input<string>('TITULO');
  pedidos = input.required<Pedido[]>();
  isLoading = input.required<boolean>();
  totalRecords = input.required<number>();

  public mostrarFiltroEstados = input<boolean>(true);
  public opcionesEstado = signal<OpcionEstado[]>(
    Object.entries(EstadoPedido).map(([label, value]) => ({
      label,
      value,
    })),
  );
  public estadoSeleccionado = model.required<EstadoPedidoType | 'TODOS'>();

  async ngOnInit() {
    this.paginationStore.resetPagination();
    this.opcionesEstado.set([{ label: 'TODOS', value: null }, ...this.opcionesEstado()]);
    this.estadoSeleccionado.set('TODOS');
  }
}
