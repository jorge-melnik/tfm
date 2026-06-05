import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';
import { UserStore } from '@shared/services/stores/user.store';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, MenuModule, Button],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  private _userStore = inject(UserStore);

  public items = computed<MenuItem[]>(() => {
    const user = this._userStore.user();
    if (!user)
      return [
        {
          label: 'No autenticado',
          items: [{ label: 'Iniciar sesión', icon: 'pi pi-user-edit', routerLink: '/auth/login' }],
        },
      ];
    return [
      {
        label: 'el-username',
        items: [
          { label: 'Mis datos', icon: 'pi pi-user-edit', routerLink: '/' },
          { label: 'Comprar', icon: 'pi pi-shopping-cart', routerLink: '/consumidor' },
          { label: 'Vender', icon: 'pi pi-shop', routerLink: '/productor' },
          { label: 'Administrar', icon: 'pi pi-cog', routerLink: '/admin' },
        ],
      },
    ];
  });
}
