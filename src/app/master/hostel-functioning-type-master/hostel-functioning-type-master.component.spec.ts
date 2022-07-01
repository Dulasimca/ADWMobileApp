import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostelFunctioningTypeMasterComponent } from './hostel-functioning-type-master.component';

describe('HostelFunctioningTypeMasterComponent', () => {
  let component: HostelFunctioningTypeMasterComponent;
  let fixture: ComponentFixture<HostelFunctioningTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostelFunctioningTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostelFunctioningTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
