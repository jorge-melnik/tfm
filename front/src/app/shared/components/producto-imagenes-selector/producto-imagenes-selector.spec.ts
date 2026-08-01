import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoImagenesSelector } from './producto-imagenes-selector';

describe('ProductoImagenesSelector', () => {
  let component: ProductoImagenesSelector;
  let fixture: ComponentFixture<ProductoImagenesSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoImagenesSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoImagenesSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
