import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaCard } from './pregunta.card';

describe('PreguntaCard', () => {
  let component: PreguntaCard;
  let fixture: ComponentFixture<PreguntaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PreguntaCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
