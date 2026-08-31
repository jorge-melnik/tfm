import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductorPage } from './productor.page';

describe('ProductorPage', () => {
  let component: ProductorPage;
  let fixture: ComponentFixture<ProductorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductorPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
