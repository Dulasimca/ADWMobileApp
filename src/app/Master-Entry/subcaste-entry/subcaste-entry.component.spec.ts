import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcasteEntryComponent } from './subcaste-entry.component';

describe('SubcasteEntryComponent', () => {
  let component: SubcasteEntryComponent;
  let fixture: ComponentFixture<SubcasteEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcasteEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcasteEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
