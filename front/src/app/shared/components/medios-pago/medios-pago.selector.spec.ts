import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediosPagoSelector } from './medios-pago.selector';

describe('MediosPagoSelector', () => {
  let component: MediosPagoSelector;
  let fixture: ComponentFixture<MediosPagoSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediosPagoSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(MediosPagoSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
