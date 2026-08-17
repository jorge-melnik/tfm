import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { ButtonDirective } from 'primeng/button';
import { UserStore } from '@shared/services/stores/user.store';
import { Popover, PopoverModule } from 'primeng/popover';
import { Cog, Shop, ShoppingCart, SignIn, SignOut, User, UserEdit } from '@primeicons/angular';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    MenuModule,
    ButtonDirective,
    Popover,
    PopoverModule,
    UserEdit,
    User,
    Shop,
    Cog,
    Shop,
    ShoppingCart,
    SignOut,
    SignIn,
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  public readonly userStore = inject(UserStore);
}
