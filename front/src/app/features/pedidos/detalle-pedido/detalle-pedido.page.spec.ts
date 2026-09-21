import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePedidoPage } from './detalle-pedido.page';

describe('DetallePedidoPage', () => {
  let component: DetallePedidoPage;
  let fixture: ComponentFixture<DetallePedidoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallePedidoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(DetallePedidoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
