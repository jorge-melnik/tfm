import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasPage } from './compras.page';

describe('ComprasPage', () => {
  let component: ComprasPage;
  let fixture: ComponentFixture<ComprasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ComprasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
