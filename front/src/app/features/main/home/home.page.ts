import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-home-main',
  imports: [RouterLink, Button, Card],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage {
  public productos = [
    {
      id: 1,
      productor: 'Prod 1',
      nombre: 'Nombre 1',
      precio: 100,
    },
    {
      id: 2,
      productor: 'Prod 2',
      nombre: 'Nombre 2',
      precio: 200,
    },
    {
      id: 3,
      productor: 'Prod 3',
      nombre: 'Nombre 3',
      precio: 300,
    },
  ];
}
