import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverEditablePercentComponent } from './hover-editable-percent.component';

describe('HoverEditablePercentComponent', () => {
  let component: HoverEditablePercentComponent;
  let fixture: ComponentFixture<HoverEditablePercentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoverEditablePercentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoverEditablePercentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
