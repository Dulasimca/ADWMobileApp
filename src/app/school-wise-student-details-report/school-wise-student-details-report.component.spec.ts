import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolWiseStudentDetailsReportComponent } from './school-wise-student-details-report.component';

describe('SchoolWiseStudentDetailsReportComponent', () => {
  let component: SchoolWiseStudentDetailsReportComponent;
  let fixture: ComponentFixture<SchoolWiseStudentDetailsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolWiseStudentDetailsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolWiseStudentDetailsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
