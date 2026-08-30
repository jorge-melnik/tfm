import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntasPage } from './preguntas.page';

describe('PreguntasPage', () => {
  let component: PreguntasPage;
  let fixture: ComponentFixture<PreguntasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntasPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntasPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
