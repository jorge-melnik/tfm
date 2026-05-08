import { Component } from '@angular/core';
import { CategoriaForm } from '../form/categoria.form';

@Component({
  selector: 'app-categoria-create',
  imports: [CategoriaForm],
  templateUrl: './categoria-create.page.html',
  styleUrl: './categoria-create.page.css',
})
export class CategoriaCreatePage {}
