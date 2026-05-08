import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaCreatePage } from './categoria-create.page';

describe('CategoriaCreatePage', () => {
  let component: CategoriaCreatePage;
  let fixture: ComponentFixture<CategoriaCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaCreatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaCreatePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
