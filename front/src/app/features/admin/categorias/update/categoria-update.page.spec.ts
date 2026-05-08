import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaUpdatePage } from './categoria-update.page';

describe('CategoriaUpdatePage', () => {
  let component: CategoriaUpdatePage;
  let fixture: ComponentFixture<CategoriaUpdatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaUpdatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaUpdatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
