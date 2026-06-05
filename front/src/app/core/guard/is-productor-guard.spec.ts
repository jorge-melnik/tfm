import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isProductorGuard } from './is-productor-guard';

describe('isProductorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isProductorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
