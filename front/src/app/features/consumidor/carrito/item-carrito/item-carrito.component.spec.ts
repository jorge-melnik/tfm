import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemCarritoComponent } from './item-carrito.component';

describe('ItemCarritoComponent', () => {
  let component: ItemCarritoComponent;
  let fixture: ComponentFixture<ItemCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemCarritoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCarritoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
