import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosProductorEditPage } from './productos-productor-edit.page';

describe('ProductosProductorEditPage', () => {
  let component: ProductosProductorEditPage;
  let fixture: ComponentFixture<ProductosProductorEditPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosProductorEditPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosProductorEditPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
