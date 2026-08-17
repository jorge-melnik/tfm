import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasPagarPage } from './compras-pagar.page';

describe('ComprasPagarPage', () => {
  let component: ComprasPagarPage;
  let fixture: ComponentFixture<ComprasPagarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasPagarPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasPagarPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
