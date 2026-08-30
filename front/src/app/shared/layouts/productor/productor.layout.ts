import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-productor-layout',
  standalone: true,
  imports: [RouterOutlet, Tabs, TabList, Tab, RouterLink, TopBarComponent],
  templateUrl: './productor.layout.html',
  styleUrl: './productor.layout.css',
})
export class ProductorLayout implements OnInit {
  private userStore = inject(UserStore);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public user = this.userStore.user;
  public tabActiva = signal<string>('inicio');

  constructor() {
    //No encontré como hacerlo sin rxjs
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
    if (this.user()) {
      this.authService.cambiarRolActualA('PRODUCTOR');
    }
    // this.updateActiveTab(this.router.url); //Esto se ejecuta únicamente cuando entra a la vista de productor. No sirve.
  }

  private updateActiveTab(url: string): void {
    if (url.includes('/productos')) {
      this.tabActiva.set('productos');
    } else if (url.includes('/pedidos')) {
      this.tabActiva.set('pedidos');
    } else if (url.includes('/consultas')) {
      this.tabActiva.set('consultas');
    } else {
      this.tabActiva.set('inicio');
    }
  }
}
