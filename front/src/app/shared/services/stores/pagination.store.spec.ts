import { TestBed } from '@angular/core/testing';

import { PaginationStore } from './pagination.store';

describe('PaginationStore', () => {
  let service: PaginationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginationStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
