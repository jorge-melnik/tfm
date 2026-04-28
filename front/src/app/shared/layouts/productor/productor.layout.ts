import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { Tabs, TabList, Tab } from 'primeng/tabs';

@Component({
  selector: 'app-productor-layout',
  imports: [Button, RouterOutlet, Tabs, TabList, Tab, RouterLink],
  templateUrl: './productor.layout.html',
  styleUrl: './productor.layout.css',
})
export class ProductorLayout {}
