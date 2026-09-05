import { TestBed } from '@angular/core/testing';

import { UbicacionActual } from './ubicacion-actual';

describe('UbicacionActual', () => {
  let service: UbicacionActual;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UbicacionActual);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
