import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionSelector } from './ubicacion-selector';

describe('UbicacionSelector', () => {
  let component: UbicacionSelector;
  let fixture: ComponentFixture<UbicacionSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicacionSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(UbicacionSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
