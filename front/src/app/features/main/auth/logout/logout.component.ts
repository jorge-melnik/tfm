import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '@shared/services/auth.service';
import { DialogService } from '@shared/services/dialog.service';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.component.html',

  styleUrl: './logout.component.css',
})
export class LogoutComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  async ngOnInit() {
    console.log('onInit');
    try {
      this.authService.doLogout();
      this.dialogService.addSuccess('Sesión terminada.');
    } catch (error: any) {
      this.dialogService.addError(error.error ? error.error.message : error.message);
    }
  }
}
