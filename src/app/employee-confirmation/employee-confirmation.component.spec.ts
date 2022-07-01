import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeConfirmationComponent } from './employee-confirmation.component';

describe('EmployeeConfirmationComponent', () => {
  let component: EmployeeConfirmationComponent;
  let fixture: ComponentFixture<EmployeeConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
