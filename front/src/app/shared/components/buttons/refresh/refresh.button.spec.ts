import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshButton } from './refresh.button';

describe('RefreshButton', () => {
  let component: RefreshButton;
  let fixture: ComponentFixture<RefreshButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RefreshButton],
    }).compileComponents();

    fixture = TestBed.createComponent(RefreshButton);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
