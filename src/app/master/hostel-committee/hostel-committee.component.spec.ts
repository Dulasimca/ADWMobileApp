import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelCommitteeComponent } from './hostel-committee.component';

describe('HostelCommitteeComponent', () => {
  let component: HostelCommitteeComponent;
  let fixture: ComponentFixture<HostelCommitteeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelCommitteeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelCommitteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
