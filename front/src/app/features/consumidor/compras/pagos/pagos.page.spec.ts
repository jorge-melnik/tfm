import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosPage } from './pagos.page';

describe('PagosPage', () => {
  let component: PagosPage;
  let fixture: ComponentFixture<PagosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PagosPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
