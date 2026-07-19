import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuieroComprarComponent } from './quiero-comprar.component';

describe('QuieroComprarComponent', () => {
  let component: QuieroComprarComponent;
  let fixture: ComponentFixture<QuieroComprarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuieroComprarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuieroComprarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
