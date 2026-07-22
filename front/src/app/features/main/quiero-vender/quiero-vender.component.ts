import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';

import { IftaLabelModule, IftaLabel } from 'primeng/iftalabel';

@Component({
  selector: 'app-quiero-vender',
  imports: [TextareaModule, Card, ButtonDirective, IftaLabel],
  templateUrl: './quiero-vender.component.html',

  styleUrl: './quiero-vender.component.css',
})
export class QuieroVenderComponent {}
