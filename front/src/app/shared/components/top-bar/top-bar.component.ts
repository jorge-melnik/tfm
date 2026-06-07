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

    const items = [{ label: 'Mis datos', icon: 'pi pi-user-edit', routerLink: '/' }];
    //Funciones con roles actuales
    if (this._userStore.userHasRole('CONSUMIDOR') && user.rol_actual !== 'CONSUMIDOR')
      items.push({ label: 'Comprar', icon: 'pi pi-shopping-cart', routerLink: '/consumidor' });
    if (this._userStore.userHasRole('PRODUCTOR') && user.rol_actual !== 'PRODUCTOR')
      items.push({ label: 'Vender', icon: 'pi pi-shop', routerLink: '/productor' });
    if (this._userStore.userHasRole('ADMIN') && user.rol_actual !== 'ADMIN')
      items.push({ label: 'Administrar', icon: 'pi pi-cog', routerLink: '/admin' });

    //Quiero tal (activar otro rol)
    if (!this._userStore.userHasRole('CONSUMIDOR'))
      items.push({
        label: 'Quiero Comprar',
        icon: 'pi pi-shopping-cart',
        routerLink: '/quiero/comprar',
      });
    if (!this._userStore.userHasRole('PRODUCTOR'))
      items.push({
        label: 'Quiero Vender',
        icon: 'pi pi-shop',
        routerLink: '/quiero/vender',
      });

    items.push({ label: 'Logout', icon: 'pi pi-sign-out', routerLink: '/auth/logout' });
    return [{ label: user.username, items }];
  });
}
