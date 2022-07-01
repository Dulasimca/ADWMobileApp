import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalCountDashboardComponent } from './total-count-dashboard.component';

describe('TotalCountDashboardComponent', () => {
  let component: TotalCountDashboardComponent;
  let fixture: ComponentFixture<TotalCountDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalCountDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalCountDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
