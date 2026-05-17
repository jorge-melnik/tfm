import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-top-bar',
  imports: [RouterLink, MenuModule, Button],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
})
export class TopBarComponent {
  items: MenuItem[] = [
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
}
