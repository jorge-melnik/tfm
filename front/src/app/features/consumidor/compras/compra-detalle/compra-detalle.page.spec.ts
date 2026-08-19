import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraDetallePage } from './compra-detalle.page';

describe('CompraDetallePage', () => {
  let component: CompraDetallePage;
  let fixture: ComponentFixture<CompraDetallePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompraDetallePage],
    }).compileComponents();

    fixture = TestBed.createComponent(CompraDetallePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
