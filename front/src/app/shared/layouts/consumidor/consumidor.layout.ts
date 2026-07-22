import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';
import { Badge } from 'primeng/badge';
import { CarritoService } from '@shared/services/carrito.service';

@Component({
  selector: 'app-consumidor-layout',
  imports: [RouterOutlet, Tabs, TabList, Tab, RouterLink, TopBarComponent, Badge],
  templateUrl: './consumidor.layout.html',

  styleUrl: './consumidor.layout.css',
})
export class ConsumidorLayout implements OnInit {
  private userStore = inject(UserStore);
  private authService = inject(AuthService);
  protected _carritoService = inject(CarritoService);

  async ngOnInit(): Promise<void> {
    const user = this.userStore.user();
    if (!user) return;
    this.authService.cambiarRolActualA('CONSUMIDOR');
  }
}
