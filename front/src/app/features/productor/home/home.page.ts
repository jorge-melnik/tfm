import { Component, inject, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-home-productor',
  imports: [RouterLink],
  templateUrl: './home.page.html',

  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _authService = inject(AuthService);
  public totalPreguntasPendientes = signal<number>(0);
  public totalMensajesPendientes = signal<number>(0);
  public totalStockCritico = signal<number>(0);
  public totalPedidosPendientes = signal<number>(0);

  async ngOnInit() {}
}
