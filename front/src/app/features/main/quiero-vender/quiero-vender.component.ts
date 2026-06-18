import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { Button } from 'primeng/button';

import { IftaLabelModule, IftaLabel } from 'primeng/iftalabel';

@Component({
  selector: 'app-quiero-vender',
  imports: [TextareaModule, Card, Button, IftaLabel],
  templateUrl: './quiero-vender.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './quiero-vender.component.css',
})
export class QuieroVenderComponent {}
