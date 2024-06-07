import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverEditableFieldComponent } from './hover-editable-field.component';

describe('HoverEditableFieldComponent', () => {
  let component: HoverEditableFieldComponent;
  let fixture: ComponentFixture<HoverEditableFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverEditableFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoverEditableFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
