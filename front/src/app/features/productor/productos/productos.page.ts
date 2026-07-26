import { Component } from '@angular/core';
import { ProductosTable } from './components/productos/productos.table';

@Component({
  selector: 'app-productoos',
  imports: [ProductosTable],
  templateUrl: './productos.page.html',

  styleUrl: './productos.page.css',
})
export class ProductosPage {}
