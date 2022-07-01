import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelClosingdateEntryComponent } from './hostel-closingdate-entry.component';

describe('HostelClosingdateEntryComponent', () => {
  let component: HostelClosingdateEntryComponent;
  let fixture: ComponentFixture<HostelClosingdateEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelClosingdateEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelClosingdateEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
