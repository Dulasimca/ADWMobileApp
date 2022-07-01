import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineRegistrationCheckComponent } from './online-registration-check.component';

describe('OnlineRegistrationCheckComponent', () => {
  let component: OnlineRegistrationCheckComponent;
  let fixture: ComponentFixture<OnlineRegistrationCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineRegistrationCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineRegistrationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
