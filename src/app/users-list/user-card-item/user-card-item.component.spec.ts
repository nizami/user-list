import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCardItemComponent } from './user-card-item.component';

describe('UserCardItemComponent', () => {
  let component: UserCardItemComponent;
  let fixture: ComponentFixture<UserCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
