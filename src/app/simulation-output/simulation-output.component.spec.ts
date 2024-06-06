import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationOutputComponent } from './simulation-output.component';

describe('SimulationOutputComponent', () => {
  let component: SimulationOutputComponent;
  let fixture: ComponentFixture<SimulationOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationOutputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulationOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
