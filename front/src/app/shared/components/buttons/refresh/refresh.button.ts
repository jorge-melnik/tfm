import { Component, input, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-refresh-btn',
  imports: [Button],
  templateUrl: './refresh.button.html',
  styleUrl: './refresh.button.css',
})
export class RefreshButton {
  isLoading = input<boolean>(false);

  // Si queremos que sea solo texto sin fondo
  text = input<boolean>(false);

  // Emisor del evento
  refresh = output<void>();
}
