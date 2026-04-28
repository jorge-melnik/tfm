import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';
import { TabsModule, Tabs, TabList, Tab, TabPanel, TabPanels } from 'primeng/tabs';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, Button, TabsModule, Tabs, TabList, Tab, TabPanel, TabPanels],
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.css',
})
export class MainLayout {}
