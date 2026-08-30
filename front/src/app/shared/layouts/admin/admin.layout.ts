import { Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Tabs,
    TabList,
    Tab,
    RouterLink,
    TopBarComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './admin.layout.html',
  styleUrl: './admin.layout.css',
})
export class AdminLayout implements OnInit {
  private userStore = inject(UserStore);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public tabActiva = signal<string>('inicio');

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
      this.authService.cambiarRolActualA('ADMIN');
    }
    this.updateActiveTab(this.router.url);
  }

  private updateActiveTab(url: string): void {
    if (url.includes('/admin/categorias')) {
      this.tabActiva.set('categorias');
    } else if (url.includes('/admin/subcategorias')) {
      this.tabActiva.set('subcategorias');
    } else if (url.includes('/admin/etiquetas')) {
      this.tabActiva.set('etiquetas');
    } else {
      this.tabActiva.set('inicio');
    }
  }
}
