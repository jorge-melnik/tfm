import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Tabs, TabList, Tab } from 'primeng/tabs';

@Component({
  selector: 'app-admin-layout',
  imports: [Button, RouterOutlet, Tabs, TabList, Tab, RouterLink],
  templateUrl: './admin.layout.html',
  styleUrl: './admin.layout.css',
})
export class AdminLayout {}
