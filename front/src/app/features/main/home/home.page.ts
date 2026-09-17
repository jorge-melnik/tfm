import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cog, ShoppingCart, Tag } from '@primeicons/angular';
import { UserStore } from '@shared/services/stores/user.store';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-home-main',
  imports: [RouterLink, ButtonDirective, ShoppingCart, Tag, Cog],
  templateUrl: './home.page.html',

  styleUrl: './home.page.css',
})
export class HomePage {
  public readonly userStore = inject(UserStore);
}
