import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMasterEntryComponent } from './unit-master-entry.component';

describe('UnitMasterEntryComponent', () => {
  let component: UnitMasterEntryComponent;
  let fixture: ComponentFixture<UnitMasterEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitMasterEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMasterEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
