import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationInputsComponent } from './simulation-inputs.component';

describe('RangeInputsComponent', () => {
  let component: SimulationInputsComponent;
  let fixture: ComponentFixture<SimulationInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
