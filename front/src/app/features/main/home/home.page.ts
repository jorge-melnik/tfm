import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStore } from '@shared/services/stores/user.store';

@Component({
  selector: 'app-home-main',
  imports: [RouterLink],
  templateUrl: './home.page.html',

  styleUrl: './home.page.css',
})
export class HomePage {
  public readonly userStore = inject(UserStore);
}
