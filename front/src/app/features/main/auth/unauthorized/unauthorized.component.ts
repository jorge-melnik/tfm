import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ExclamationTriangle, Home, SignOut } from '@primeicons/angular';
import { AuthService } from '@shared/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-unauthorized',
  imports: [ButtonModule, Card, Home, SignOut, ExclamationTriangle],
  templateUrl: './unauthorized.component.html',

  styleUrl: './unauthorized.component.css',
})
export class UnauthorizedComponent {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  onLogoutAndLogin(): void {
    this._router.navigate(['/auth/logout']);
  }

  goHome(): void {
    this._router.navigate(['/']);
  }
}
