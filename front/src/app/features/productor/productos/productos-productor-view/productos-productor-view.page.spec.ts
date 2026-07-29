import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosProductorViewPage } from './productos-productor-view.page';

describe('ProductosProductorViewPage', () => {
  let component: ProductosProductorViewPage;
  let fixture: ComponentFixture<ProductosProductorViewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosProductorViewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosProductorViewPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
