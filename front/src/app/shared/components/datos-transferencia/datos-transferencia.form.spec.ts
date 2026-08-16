import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTransferenciaForm } from './datos-transferencia.form';

describe('DatosTransferenciaForm', () => {
  let component: DatosTransferenciaForm;
  let fixture: ComponentFixture<DatosTransferenciaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosTransferenciaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosTransferenciaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
