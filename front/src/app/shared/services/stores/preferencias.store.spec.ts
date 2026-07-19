import { TestBed } from '@angular/core/testing';

import { PreferenciasStore } from './preferencias.store';

describe('PreferenciasStore', () => {
  let service: PreferenciasStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferenciasStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
