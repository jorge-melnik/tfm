import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-admin-layout',
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

  async ngOnInit(): Promise<void> {
    const user = this.userStore.user();
    if (!user) return;
    this.authService.cambiarRolActualA('ADMIN');
  }
}
