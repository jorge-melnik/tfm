import { Component, output } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-create-btn',
  imports: [Button],
  templateUrl: './create.button.html',
  styleUrl: './create.button.css',
})
export class CreateButton {
  public create = output();
}
