import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PreferenciasStore {
  private _limit = signal<number>(10);

  public limit = this._limit.asReadonly(); //Esto es para que no vayan a cambiar la referencia de la signal.

  public setLimit(nuevoLimit: number) {
    console.log({ nuevoLimit });
    this._limit.set(nuevoLimit);
  }
}
