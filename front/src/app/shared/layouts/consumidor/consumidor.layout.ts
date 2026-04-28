import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Tabs, TabList, Tab } from 'primeng/tabs';

@Component({
  selector: 'app-consumidor-layout',
  imports: [Button, RouterOutlet, Tabs, TabList, Tab, RouterLink],
  templateUrl: './consumidor.layout.html',
  styleUrl: './consumidor.layout.css',
})
export class ConsumidorLayout {}
