import { DestroyRef, inject, Injectable, Service, signal } from '@angular/core';
import { Coordenadas } from '@shared/types/ubicacion';

@Injectable()
export class UbicacionActual {
  private destroyRef = inject(DestroyRef);
  private watchId: number | null = null;

  private _ubicacion = signal<Coordenadas | null>(null);
  private _error = signal<string | null>(null);

  public readonly ubicacion = this._ubicacion.asReadonly();
  public readonly error = this._error.asReadonly();

  constructor() {
    this.iniciarRastreo();
    this.destroyRef.onDestroy(() => {
      this.detenerRastreo();
      console.log('Geolocalización detenida y servicio destruido');
    });
  }

  private iniciarRastreo(): void {
    if (!('geolocation' in navigator)) {
      console.error('Geolocalización no disponible');
      this._error.set('Geolocalización no disponible.');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (pos) => {
        this._ubicacion.set({
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
        });
      },
      (err) => this._error.set(err.message),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }

  private detenerRastreo(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }
}
