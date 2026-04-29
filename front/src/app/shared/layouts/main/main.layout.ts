import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { Button } from 'primeng/button';
import { TabsModule, Tabs, TabList, Tab, TabPanel, TabPanels } from 'primeng/tabs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TabsModule, TopBarComponent],
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.css',
})
export class MainLayout {}
