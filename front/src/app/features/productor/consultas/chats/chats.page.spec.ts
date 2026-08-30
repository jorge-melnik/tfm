import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsPage } from './chats.page';

describe('ChatsPage', () => {
  let component: ChatsPage;
  let fixture: ComponentFixture<ChatsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
