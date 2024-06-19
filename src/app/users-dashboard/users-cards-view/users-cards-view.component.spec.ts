import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCardsViewComponent } from './users-cards-view.component';

describe('UsersCardsViewComponent', () => {
  let component: UsersCardsViewComponent;
  let fixture: ComponentFixture<UsersCardsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCardsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersCardsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
