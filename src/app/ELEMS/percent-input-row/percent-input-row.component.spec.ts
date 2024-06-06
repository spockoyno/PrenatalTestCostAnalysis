import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentInputRowComponent } from './percent-input-row.component';

describe('PercentInputRowComponent', () => {
  let component: PercentInputRowComponent;
  let fixture: ComponentFixture<PercentInputRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercentInputRowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PercentInputRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
