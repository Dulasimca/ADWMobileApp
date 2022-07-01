import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentcountReportComponent } from './studentcount-report.component';

describe('StudentcountReportComponent', () => {
  let component: StudentcountReportComponent;
  let fixture: ComponentFixture<StudentcountReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentcountReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentcountReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
