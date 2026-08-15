import { Component, input } from '@angular/core';

@Component({
  selector: 'app-compras-pagar',
  imports: [],
  templateUrl: './compras-pagar.page.html',
  styleUrl: './compras-pagar.page.css',
})
export class ComprasPagarPage {
  public id_compra = input.required();
}
