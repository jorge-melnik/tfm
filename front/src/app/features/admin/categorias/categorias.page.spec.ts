import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasPage } from './categorias.page';

describe('CategoriasPage', () => {
  let component: CategoriasPage;
  let fixture: ComponentFixture<CategoriasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
