import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelWiseDashboardComponent } from './hostel-wise-dashboard.component';

describe('HostelWiseDashboardComponent', () => {
  let component: HostelWiseDashboardComponent;
  let fixture: ComponentFixture<HostelWiseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelWiseDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelWiseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
