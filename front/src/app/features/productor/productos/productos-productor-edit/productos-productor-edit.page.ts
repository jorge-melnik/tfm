import { Component, input } from '@angular/core';

@Component({
  selector: 'app-productos-productor-edit',
  imports: [],
  templateUrl: './productos-productor-edit.page.html',
  styleUrl: './productos-productor-edit.page.css',
})
export class ProductosProductorEditPage {
  public productor = input.required<string>();
  public producto = input.required<string>();
}
