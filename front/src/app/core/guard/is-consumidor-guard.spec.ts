import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isConsumidorGuard } from './is-consumidor-guard';

describe('isConsumidorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isConsumidorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
