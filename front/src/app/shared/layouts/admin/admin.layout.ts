import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Tabs, TabList, Tab, RouterLink, TopBarComponent],
  templateUrl: './admin.layout.html',
  styleUrl: './admin.layout.css',
})
export class AdminLayout {}
