import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatsPedidoComponent } from './chats-pedido.component';

describe('ChatsPedidoComponent', () => {
  let component: ChatsPedidoComponent;
  let fixture: ComponentFixture<ChatsPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsPedidoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsPedidoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
