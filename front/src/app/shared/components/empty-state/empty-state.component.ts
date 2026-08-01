import { Component, input } from '@angular/core';
import { Inbox } from '@primeicons/angular';

@Component({
  selector: 'app-empty-state',
  imports: [Inbox],
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.css',
})
export class EmptyStateComponent {
  titulo = input<string>();
  subtitulo = input<string>();
}
