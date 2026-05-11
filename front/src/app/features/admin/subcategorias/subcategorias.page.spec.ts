import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriasPage } from './subcategorias.page';

describe('SubcategoriasPage', () => {
  let component: SubcategoriasPage;
  let fixture: ComponentFixture<SubcategoriasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoriasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(SubcategoriasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
