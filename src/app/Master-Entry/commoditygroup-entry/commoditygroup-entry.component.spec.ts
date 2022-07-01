import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommoditygroupEntryComponent } from './commoditygroup-entry.component';

describe('CommoditygroupEntryComponent', () => {
  let component: CommoditygroupEntryComponent;
  let fixture: ComponentFixture<CommoditygroupEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommoditygroupEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommoditygroupEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
