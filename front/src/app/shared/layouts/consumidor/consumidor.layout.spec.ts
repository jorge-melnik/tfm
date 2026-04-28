import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumidorLayout } from './consumidor.layout';

describe('ConsumidorLayout', () => {
  let component: ConsumidorLayout;
  let fixture: ComponentFixture<ConsumidorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsumidorLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsumidorLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
