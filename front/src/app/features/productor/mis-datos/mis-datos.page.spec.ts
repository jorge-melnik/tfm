import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisDatosPage } from './mis-datos.page';

describe('MisDatosPage', () => {
  let component: MisDatosPage;
  let fixture: ComponentFixture<MisDatosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisDatosPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MisDatosPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
