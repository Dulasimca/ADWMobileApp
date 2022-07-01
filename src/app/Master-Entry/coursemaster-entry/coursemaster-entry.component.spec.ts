import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursemasterEntryComponent } from './coursemaster-entry.component';

describe('CoursemasterEntryComponent', () => {
  let component: CoursemasterEntryComponent;
  let fixture: ComponentFixture<CoursemasterEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursemasterEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursemasterEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
