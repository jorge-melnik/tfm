import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosTarjetaForm } from './datos-tarjeta.form';

describe('DatosTarjetaForm', () => {
  let component: DatosTarjetaForm;
  let fixture: ComponentFixture<DatosTarjetaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosTarjetaForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DatosTarjetaForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
