import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelDashboardComponent } from './hostel-dashboard.component';

describe('HostelDashboardComponent', () => {
  let component: HostelDashboardComponent;
  let fixture: ComponentFixture<HostelDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
