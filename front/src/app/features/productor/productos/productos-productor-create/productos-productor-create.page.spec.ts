import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosProductorCreatePage } from './productos-productor-create.page';

describe('ProductosProductorCreatePage', () => {
  let component: ProductosProductorCreatePage;
  let fixture: ComponentFixture<ProductosProductorCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosProductorCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosProductorCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
