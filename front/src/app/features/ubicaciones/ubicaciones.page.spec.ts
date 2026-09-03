import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionesPage } from './ubicaciones.page';

describe('UbicacionesPage', () => {
  let component: UbicacionesPage;
  let fixture: ComponentFixture<UbicacionesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbicacionesPage],
    }).compileComponents();

    fixture = TestBed.createComponent(UbicacionesPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
