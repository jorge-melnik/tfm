import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';
import { Badge } from 'primeng/badge';
import { CarritoService } from '@shared/services/carrito.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-consumidor-layout',
  standalone: true,
  imports: [RouterOutlet, Tabs, TabList, Tab, RouterLink, TopBarComponent, Badge],
  templateUrl: './consumidor.layout.html',
  styleUrl: './consumidor.layout.css',
})
export class ConsumidorLayout implements OnInit {
  private userStore = inject(UserStore);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  protected _carritoService = inject(CarritoService);

  public tabActiva = signal<string>('productos');

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        this.updateActiveTab(event.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    if (this.userStore.user()) {
      this.authService.cambiarRolActualA('CONSUMIDOR');
    }
    this.updateActiveTab(this.router.url);
  }

  private updateActiveTab(url: string): void {
    if (url.includes('/consumidor/carrito')) {
      this.tabActiva.set('carrito');
    } else if (url.includes('/consumidor/compras')) {
      this.tabActiva.set('compras');
    } else if (url.includes('/consumidor/consultas')) {
      this.tabActiva.set('consultas');
    } else {
      this.tabActiva.set('productos');
    }
  }
}
