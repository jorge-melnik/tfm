import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrarPage } from './borrar.page';

describe('BorrarPage', () => {
  let component: BorrarPage;
  let fixture: ComponentFixture<BorrarPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrarPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BorrarPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
