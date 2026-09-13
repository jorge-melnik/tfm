import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-consultas',
  imports: [RouterLink],
  templateUrl: './consultas.page.html',
  styleUrl: './consultas.page.css',
})
export class ConsultasPage {
  private readonly _authService = inject(AuthService);
  public totalPreguntasPendientes = signal<number>(0);
  public totalMensajesPendientes = signal<number>(0);
}
