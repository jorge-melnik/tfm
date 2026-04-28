import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-consumidor',
  imports: [Button, RouterOutlet],
  templateUrl: './consumidor.layout.html',
  styleUrl: './consumidor.layout.css',
})
export class ConsumidorLayout {}
