import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cog, ShoppingCart, Tag } from '@primeicons/angular';
import { UserStore } from '@shared/services/stores/user.store';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home-admin',
  imports: [RouterLink, ButtonModule, Tag],
  templateUrl: './home.page.html',

  styleUrl: './home.page.css',
})
export class HomePage {
  public userStore = inject(UserStore);
}
