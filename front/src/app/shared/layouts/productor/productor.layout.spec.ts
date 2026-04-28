import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductorLayout } from './productor.layout';

describe('ProductorLayout', () => {
  let component: ProductorLayout;
  let fixture: ComponentFixture<ProductorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductorLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductorLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
