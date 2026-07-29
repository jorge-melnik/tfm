import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosFilter } from './productos.filter';

describe('ProductosFilter', () => {
  let component: ProductosFilter;
  let fixture: ComponentFixture<ProductosFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
