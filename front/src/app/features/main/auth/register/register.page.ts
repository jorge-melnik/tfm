import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-register',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    RouterLink,
    SelectButtonModule,
    FormsModule,
  ],
  templateUrl: './register.page.html',

  styleUrl: './register.page.css',
})
export class RegisterPage {
  public selectedRoles = input<number[]>([]);
}
