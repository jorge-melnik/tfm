import { TestBed } from '@angular/core/testing';

import { EtiquetasStore } from './etiquetas.store';

describe('EtiquetasStore', () => {
  let service: EtiquetasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtiquetasStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
