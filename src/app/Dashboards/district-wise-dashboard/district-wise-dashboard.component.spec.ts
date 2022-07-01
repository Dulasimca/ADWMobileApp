import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictWiseDashboardComponent } from './district-wise-dashboard.component';

describe('DistrictWiseDashboardComponent', () => {
  let component: DistrictWiseDashboardComponent;
  let fixture: ComponentFixture<DistrictWiseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistrictWiseDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictWiseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
