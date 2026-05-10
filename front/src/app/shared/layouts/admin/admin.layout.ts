import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
export class AdminLayout {}
