import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';

@Component({
  selector: 'app-productor-layout',
  imports: [RouterOutlet, Tabs, TabList, Tab, RouterLink, TopBarComponent],
  templateUrl: './productor.layout.html',
  styleUrl: './productor.layout.css',
})
export class ProductorLayout {}
