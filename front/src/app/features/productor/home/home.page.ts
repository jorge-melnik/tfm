import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-home-productor',
  imports: [],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _authService = inject(AuthService);

  async ngOnInit() {}
}
