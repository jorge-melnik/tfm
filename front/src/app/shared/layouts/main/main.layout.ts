import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { ButtonDirective } from 'primeng/button';
import { TabsModule, Tabs, TabList, Tab, TabPanel, TabPanels } from 'primeng/tabs';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, TabsModule, TopBarComponent],
  templateUrl: './main.layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './main.layout.css',
})
export class MainLayout {}
