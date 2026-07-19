import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtiquetasPage } from './etiquetas.page';

describe('EtiquetasPage', () => {
  let component: EtiquetasPage;
  let fixture: ComponentFixture<EtiquetasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiquetasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EtiquetasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
