import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelwisedataReportComponent } from './hostelwisedata-report.component';

describe('HostelwisedataReportComponent', () => {
  let component: HostelwisedataReportComponent;
  let fixture: ComponentFixture<HostelwisedataReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelwisedataReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelwisedataReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
