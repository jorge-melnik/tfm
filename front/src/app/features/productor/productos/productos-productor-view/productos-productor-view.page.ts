import { Component, input } from '@angular/core';

@Component({
  selector: 'app-productos-productor-view',
  imports: [],
  templateUrl: './productos-productor-view.page.html',
  styleUrl: './productos-productor-view.page.css',
})
export class ProductosProductorViewPage {
  public productor = input.required<string>();
  public producto = input.required<string>();
}
