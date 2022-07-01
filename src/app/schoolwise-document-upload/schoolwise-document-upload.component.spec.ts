import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolwiseDocumentUploadComponent } from './schoolwise-document-upload.component';

describe('SchoolwiseDocumentUploadComponent', () => {
  let component: SchoolwiseDocumentUploadComponent;
  let fixture: ComponentFixture<SchoolwiseDocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolwiseDocumentUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolwiseDocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
