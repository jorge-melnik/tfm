import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Tabs, TabList, Tab } from 'primeng/tabs';
import { TopBarComponent } from '@shared/components/top-bar/top-bar.component';
import { UserStore } from '@shared/services/stores/user.store';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-productor-layout',
  imports: [RouterOutlet, Tabs, TabList, Tab, RouterLink, TopBarComponent],
  templateUrl: './productor.layout.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './productor.layout.css',
})
export class ProductorLayout implements OnInit {
  private userStore = inject(UserStore);
  private authService = inject(AuthService);

  async ngOnInit(): Promise<void> {
    const user = this.userStore.user();
    if (!user) return;
    this.authService.cambiarRolActualA('PRODUCTOR');
  }
}
