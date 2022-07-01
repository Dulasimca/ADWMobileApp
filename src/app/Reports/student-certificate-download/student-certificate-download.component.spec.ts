import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCertificateDownloadComponent } from './student-certificate-download.component';

describe('StudentCertificateDownloadComponent', () => {
  let component: StudentCertificateDownloadComponent;
  let fixture: ComponentFixture<StudentCertificateDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCertificateDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCertificateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
