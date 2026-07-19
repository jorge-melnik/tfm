import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuieroVenderComponent } from './quiero-vender.component';

describe('QuieroVenderComponent', () => {
  let component: QuieroVenderComponent;
  let fixture: ComponentFixture<QuieroVenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuieroVenderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuieroVenderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
