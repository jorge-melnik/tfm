import { Component, input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-productor',
  imports: [Tag, RouterLink, Avatar],
  templateUrl: './productor.page.html',
  styleUrl: './productor.page.css',
})
export class ProductorPage {
  public productor = input.required<string>();
}
