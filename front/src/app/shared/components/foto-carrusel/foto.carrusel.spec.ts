import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoCarrusel } from './foto.carrusel';

describe('FotoCarrusel', () => {
  let component: FotoCarrusel;
  let fixture: ComponentFixture<FotoCarrusel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotoCarrusel],
    }).compileComponents();

    fixture = TestBed.createComponent(FotoCarrusel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
