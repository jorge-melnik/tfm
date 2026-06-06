import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-home-productor',
  imports: [],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly _authService = inject(AuthService);

  async ngOnInit() {}
}
