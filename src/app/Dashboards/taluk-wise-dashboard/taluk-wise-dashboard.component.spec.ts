import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalukWiseDashboardComponent } from './taluk-wise-dashboard.component';

describe('TalukWiseDashboardComponent', () => {
  let component: TalukWiseDashboardComponent;
  let fixture: ComponentFixture<TalukWiseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TalukWiseDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TalukWiseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
